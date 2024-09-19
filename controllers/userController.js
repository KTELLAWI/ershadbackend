const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const Job = require("../models/jobModel");
const JoinFreelaner = require("../models/joinFreelancerModel");
const sendEmail = require("../utils/email");
//regiser
const register = async (req, res) => {
  const {
    role,
    name,
    companyName,
    contact,
    email,
    password,
    confirmPassword,
    jobTitle,
    education,
    address,
    bio,
  } = req.body;

  let companyLogo = "";
  let profilePicture = "";
  let cv = "";

  if (role === "Freelancer" && req.files) {
    if (req.files.profilePicture) {
      profilePicture = req.files.profilePicture[0].filename;
    }
    if (req.files.cv) {
      cv = req.files.cv[0].filename;
    }
  }

  if (role === "Client" && req.files && req.files.companyLogo) {
    companyLogo = req.files.companyLogo[0].filename;
  }

  if (!role || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  if (role === "Freelancer") {
    if (
      !name ||
      !jobTitle ||
      !contact ||
      !education ||
      !address ||
      password !== confirmPassword
    ) {
      return res.status(400).json({
        message:
          "Freelancer must provide name, jobTitle, contact, education, address, and passwords must match",
      });
    }
  } else if (role === "Client") {
    if (!companyName || !contact || !address || password !== confirmPassword) {
      return res.status(400).json({
        message:
          "Client must provide companyName, contact, bio, address, and passwords must match",
      });
    }
  } else if (role === "Admin") {
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords must match for Admin role" });
    }
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let educationArray;
    try {
      educationArray = Array.isArray(education)
        ? education
        : JSON.parse(education || "[]");
    } catch (error) {
      return res.status(400).json({ message: "Invalid education format" });
    }
    const user = new User({
      role,
      name,
      companyName,
      profilePicture,
      companyLogo,
      education: educationArray,
      email,
      password: hashedPassword,
      jobTitle,
      contact,
      address,
      bio,
      cv,
      accountStatus: role == "Admin" ? true : true,
    });

    await user.save();
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    res
      .cookie("jwtErshad", token, { httpOnly: true })
      .status(201)
      .json({ user: user, message: "User registered successfully" });
  } catch (error) {
    console.log("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.accountStatus) {
      return res.status(403).json({ message: "تم تعطيل هذا الحساب" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Ensure lastLogin is initialized as an array
    if (!Array.isArray(user.lastLogin)) {
      user.lastLogin = [];
    }

    user.lastLogin.push(new Date());
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "2d" }
    );

    res
      .cookie("jwtErshad", token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({ user: user, message: "Login successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Invalid credentials", error: error.message });
  }
};

//logout
const logout = async (req, res) => {
  try {
    res.cookie("jwtErshad", "", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "هذا الايميل غير موجود" });
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  const resetURL = `${process.env.BASE_URL}/changePassword/${resetToken}`;

  const message = ` Forgot your password? Submit with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(400)
      .json({ message: "There was an error sending the email. Try again!" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Please provide both password and confirm password" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Password has been reset successfully" });
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }

    const skip = (page - 1) * limit;

    const users = await User.find({})
      .populate("savedJobs")
      .sort({ createdAt: -1 })
      .select("-password -confirmPassword")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({});

    res.status(200).json({
      message: "Successfully fetched users",
      data: users,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit) || 1, // Calculate total pages
        totalCount: totalUsers, // Total number of users
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }
    const skip = (page - 1) * limit;
    const clients = await User.find({ role: "Client" })
      .populate("savedJobs")
      .sort({ createdAt: -1 })
      .select("-password -confirmPassword")
      .skip(skip)
      .limit(limit);
    const totalClients = await User.countDocuments({ role: "Client" });

    res.status(200).json({
      message: "Successfully fetched clients",
      data: clients,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalClients / limit) || 1, // Calculate total pages
        totalCount: totalClients, // Total number of clients
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFreelancers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }
    const skip = (page - 1) * limit;
    const freelancers = await User.find({ role: "Freelancer" })
      .populate("savedJobs")
      .sort({ createdAt: -1 })
      .select("-password -confirmPassword")
      .skip(skip)
      .limit(limit);

    const totalFreelancers = await User.countDocuments({ role: "Freelancer" });

    res.status(200).json({
      message: "Successfully fetched freelancers",
      data: freelancers,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalFreelancers / limit) || 1, // Calculate total pages
        totalCount: totalFreelancers, // Total number of freelancers (optional)
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const profile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -confirmPassword"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Successfully fetched user profile",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const changePassword = async (req, res) => {
  const { _id } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    // Check if the _id exists and is valid
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (req.user.role !== "Admin" && userId !== id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this user" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const updateClient = async (req, res) => {
  try {
    const userId = req.user._id;
    const { companyName, contact, address, bio, email } = req.body;

    // let companyLogo = req.file ? req.file.filename : undefined;
    let companyLogo = req.file ? req.file.filename : undefined;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const updateFields = { companyName, contact, address, bio, email };
    if (email) updateFields.email = email;
    if (companyLogo) {
      updateFields.companyLogo = companyLogo;
    }

    const updatedClient = await User.findOneAndUpdate(
      { _id: userId, role: "Client" },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res
      .status(200)
      .json({ message: "Client updated successfully", updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      message: "An error occurred while updating the client",
      error: error.message,
    });
  }
};

const updateFreelancer = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const { skills, education, ...otherData } = req.body;
    const updateData = {
      $set: {
        ...otherData,
      },
    };

    if (req.user._id.toString() !== freelancerId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this data" });
    }
    if (Array.isArray(skills)) {
      updateData.$set.skills = skills;
    } else if (typeof skills === "string") {
      try {
        const parsedSkills = JSON.parse(skills);
        if (Array.isArray(parsedSkills)) {
          updateData.$set.skills = parsedSkills;
        } else {
          updateData.$set.skills = [];
        }
      } catch (e) {
        updateData.$set.skills = [];
      }
    }

    if (Array.isArray(education)) {
      updateData.$set.education = education;
    } else if (typeof education === "string") {
      try {
        const parsedEducation = JSON.parse(education);
        if (Array.isArray(parsedEducation)) {
          updateData.$set.education = parsedEducation;
        } else {
          updateData.$set.education = [];
        }
      } catch (e) {
        updateData.$set.education = [];
      }
    }
    if (req.files) {
      if (req.files.profilePicture) {
        const profilePictureFilename = req.files.profilePicture[0].filename;
        updateData.$set.profilePicture = profilePictureFilename;
      }

      if (req.files.cv) {
        const cvFilename = req.files.cv[0].filename;
        updateData.$set.cv = cvFilename;
      }
    }

    const updatedFreelancer = await User.findByIdAndUpdate(
      freelancerId,
      updateData,
      { new: true }
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    if (updatedFreelancer.skills) {
      updatedFreelancer.skills = updatedFreelancer.skills.map((skill) =>
        skill.replace(/"/g, "")
      );
    }

    res.status(200).json({
      message: "Freelancer updated successfully",
      freelancer: updatedFreelancer,
    });
  } catch (error) {
    console.error("Error updating freelancer:", error);
    res.status(500).json({ message: "Error updating freelancer", error });
  }
};
// get single user
const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCounts = async (req, res) => {
  try {
    const clientsCount = await User.countDocuments({ role: "Client" });
    const freelancersCount = await User.countDocuments({ role: "Freelancer" });
    const JoinFreelaners = await JoinFreelaner.countDocuments({});
    const jobsCount = await Job.countDocuments();

    res.status(200).json({
      clientsCount,
      freelancersCount,
      jobsCount,
      JoinFreelaners,
    });
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserRatios = async (req, res) => {
  try {
    const clientsCount = await User.countDocuments({ role: "Client" });
    const freelancersCount = await User.countDocuments({ role: "Freelancer" });

    const totalUsers = clientsCount + freelancersCount;

    if (totalUsers === 0) {
      return res.status(200).json({
        message: "No users available to calculate ratios",
        clientRatio: null,
        freelancerRatio: null,
      });
    }

    const clientRatio = ((clientsCount / totalUsers) * 100).toFixed(2);
    const freelancerRatio = ((freelancersCount / totalUsers) * 100).toFixed(2);

    res.status(200).json({
      clientsCount,
      freelancersCount,
      clientRatio: `${clientRatio}%`,
      freelancerRatio: `${freelancerRatio}%`,
      message: `Clients represent ${clientRatio}% of the total users, while Freelancers represent ${freelancerRatio}%.`,
    });
  } catch (error) {
    console.error("Error calculating user ratios:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//status for account
const toggleAccountStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "Admin") {
      return res
        .status(400)
        .json({ message: "Admin accounts cannot have their status changed" });
    }
    user.accountStatus = !user.accountStatus;
    await user.save();

    res.status(200).json({
      message: `User account status updated to ${
        user.accountStatus ? "enabled" : "disabled"
      }`,
      user,
    });
  } catch (error) {
    console.error("Error updating account status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getLoginStatsByMonth = async (req, res) => {
  try {
    const loginStats = await User.aggregate([
      {
        $match: {
          role: { $in: ["Client", "Freelancer"] },
          lastLogin: { $exists: true, $ne: [] }, // Ensure lastLogin is not empty
        },
      },
      {
        $unwind: "$lastLogin", // Flatten the array for aggregation
      },
      {
        $group: {
          _id: {
            month: { $month: "$lastLogin" },
            year: { $year: "$lastLogin" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formattedStats = loginStats.map((stat) => ({
      month: stat._id.month,
      year: stat._id.year,
      role: stat._id.role,
      count: stat.count,
    }));

    res.status(200).json({
      success: true,
      data: formattedStats,
      message: "Login statistics fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch login statistics",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  profile,
  changePassword,
  getAllClients,
  getAllFreelancers,
  deleteUser,
  updateClient,
  updateFreelancer,
  getSingleUser,
  getCounts,
  getUserRatios,
  toggleAccountStatus,
  getLoginStatsByMonth,
};
