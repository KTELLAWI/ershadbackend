// const joinFreelancer = require("../models/joinFreelancerModel");
// const User = require("../models/userModel");
// // const { Parser } = require('json2csv');
// const json2csv = require("json2csv").parse;
// const fs = require("fs");
// const path = require("path");
// const excelToJson = require("convert-excel-to-json");
// //const fs = require("fs-extra");
// const applyToWork = async (req, res) => {
//   console.log('Files:', req.files); // Logs uploaded files
//     console.log('Body:', req.body);   // Logs the rest of the form fields

//  try {
//    const {
//     country,
//     bio,
//       fullName,
//       email,
//       phoneNumber,
//       idNumber,
//       city,
//       englishLevel,
//       title,
//       jobTitle,
//       degree,
//       graduationYear,
//       willingToRelocate,
//       canWorkRemotely,
//       maritalStatus,
//     } = req.body;
// console.log(req.body);
//    const userId = req.user._id;
//    const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (req.user.role !== "Freelancer" && req.user.role !== "Admin") {
//      return res
//        .status(403)
//         .json({ message: "Only Freelancers or Admins can apply" });
//     }
//     let cvFilename =
//      req.files && req.files.cv ? req.files.cv[0].filename : undefined;
//     let profilePictureFilename =
//      req.files && req.files.profilePicture
//        ? req.files.profilePicture[0].filename
//        : undefined;

//    const status = req.user.role === "Admin" ? "تم الموافقة" : "تحت المراجعة";

//     const applicationForWork = new joinFreelancer({
//       fullName,
//       email,
//       phoneNumber,
//       idNumber,
//       city,
//       englishLevel,
//       title,
//       bio,
//       country,
//       jobTitle,
//       degree,
//       graduationYear,
//       willingToRelocate,
//       canWorkRemotely,
//        maritalStatus,
//        cv: req.files.cv ? req.files.cv[0].filename : null, // Ensure the 'cv' field exists
//       profilePicture: req.files.profilePicture ? req.files.profilePicture[0].filename : null, // Ensure 'profilePicture' exists
//      status,
//    });

//    await applicationForWork.save();

//     res.status(201).json({
//       message: "Application submitted successfully",
//      applicationForWork,
//     });
//   } catch (error) {
//     console.error("Error saving application:", error);
//     res.status(500).json({
//       message: "Failed to submit application",
//       error: error.message,
//     });
// };
// }
// const getApprovedFreelancers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;

//     if (
//       page < 1 ||
//       limit < 1 ||
//       !Number.isInteger(page) ||
//       !Number.isInteger(limit)
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Invalid page or limit parameters" });
//     }

//     const skip = (page - 1) * limit;
//     const filter = { status: "تم الموافقة" };
//     if (
//       req.query.jobTitle &&
//       req.query.jobTitle !== "null" &&
//       req.query.jobTitle !== "undefined" &&
//       req.query.jobTitle.trim() !== ""
//     ) {
//       filter.jobTitle = req.query.jobTitle;
//     }
//     if (
//       req.query.city &&
//       req.query.city !== "null" &&
//       req.query.city !== "undefined" &&
//       req.query.city.trim() !== ""
//     ) {
//       filter.city = req.query.city;
//     }
//     if (
//       req.query.country &&
//       req.query.country !== "null" &&
//       req.query.country !== "undefined" &&
//       req.query.country.trim() !== ""
//     ) {
//       filter.country = req.query.country;
//     }
//     if (
//       req.query.englishLevel &&
//       req.query.englishLevel !== "null" &&
//       req.query.englishLevel !== "undefined" &&
//       req.query.englishLevel.trim() !== ""
//     ) {
//       filter.englishLevel = req.query.englishLevel;
//     }
//     if (
//       req.query.degree &&
//       req.query.degree !== "null" &&
//       req.query.degree !== "undefined" &&
//       req.query.degree.trim() !== ""
//     ) {
//       filter.degree = req.query.degree;
//     }
//     if (
//       req.query.willingToRelocate &&
//       req.query.willingToRelocate !== "null" &&
//       req.query.willingToRelocate !== "undefined" &&
//       req.query.willingToRelocate.trim() !== ""
//     ) {
//       filter.willingToRelocate = req.query.willingToRelocate;
//     }
//     if (
//       req.query.canWorkRemotely &&
//       req.query.canWorkRemotely !== "null" &&
//       req.query.canWorkRemotely !== "undefined" &&
//       req.query.canWorkRemotely.trim() !== ""
//     ) {
//       filter.canWorkRemotely = req.query.canWorkRemotely;
//     }
//     if (
//       req.query.maritalStatus &&
//       req.query.maritalStatus !== "null" &&
//       req.query.maritalStatus !== "undefined" &&
//       req.query.maritalStatus.trim() !== ""
//     ) {
//       filter.maritalStatus = req.query.maritalStatus;
//     }
//     const freelancers = await joinFreelancer.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     const totalFreelancers = await joinFreelancer.countDocuments(filter);

//     res.status(200).json({
//       data: freelancers,
//       meta: {
//         currentPage: page,
//         totalPages: Math.ceil(totalFreelancers / limit) || 1,
//         totalCount: totalFreelancers,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving approved freelancers" });
//   }
// };

// const getPendingFreelancers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;

//     if (
//       page < 1 ||
//       limit < 1 ||
//       !Number.isInteger(page) ||
//       !Number.isInteger(limit)
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Invalid page or limit parameters" });
//     }

//     const skip = (page - 1) * limit;
//     const filter = { status: "تحت المراجعة" };
//     if (
//       req.query.jobTitle &&
//       req.query.jobTitle !== "null" &&
//       req.query.jobTitle !== "undefined" &&
//       req.query.jobTitle.trim() !== ""
//     ) {
//       filter.jobTitle = req.query.jobTitle;
//     }
//     if (
//       req.query.city &&
//       req.query.city !== "null" &&
//       req.query.city !== "undefined" &&
//       req.query.city.trim() !== ""
//     ) {
//       filter.city = req.query.city;
//     }
//     if (
//       req.query.country &&
//       req.query.country !== "null" &&
//       req.query.country !== "undefined" &&
//       req.query.country.trim() !== ""
//     ) {
//       filter.country = req.query.country;
//     }
//     if (
//       req.query.englishLevel &&
//       req.query.englishLevel !== "null" &&
//       req.query.englishLevel !== "undefined" &&
//       req.query.englishLevel.trim() !== ""
//     ) {
//       filter.englishLevel = req.query.englishLevel;
//     }
//     if (
//       req.query.degree &&
//       req.query.degree !== "null" &&
//       req.query.degree !== "undefined" &&
//       req.query.degree.trim() !== ""
//     ) {
//       filter.degree = req.query.degree;
//     }
//     if (
//       req.query.willingToRelocate &&
//       req.query.willingToRelocate !== "null" &&
//       req.query.willingToRelocate !== "undefined" &&
//       req.query.willingToRelocate.trim() !== ""
//     ) {
//       filter.willingToRelocate = req.query.willingToRelocate;
//     }
//     if (
//       req.query.canWorkRemotely &&
//       req.query.canWorkRemotely !== "null" &&
//       req.query.canWorkRemotely !== "undefined" &&
//       req.query.canWorkRemotely.trim() !== ""
//     ) {
//       filter.canWorkRemotely = req.query.canWorkRemotely;
//     }
//     if (
//       req.query.maritalStatus &&
//       req.query.maritalStatus !== "null" &&
//       req.query.maritalStatus !== "undefined" &&
//       req.query.maritalStatus.trim() !== ""
//     ) {
//       filter.maritalStatus = req.query.maritalStatus;
//     }

//     const freelancers = await joinFreelancer.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     const totalFreelancers = await joinFreelancer.countDocuments(filter);

//     const nextPage =
//       page < Math.ceil(totalFreelancers / limit) ? page + 1 : null;
//     const previousPage = page > 1 ? page - 1 : null;

//     res.status(200).json({
//       data: freelancers,
//       meta: {
//         currentPage: page,
//         totalPages: Math.ceil(totalFreelancers / limit) || 1,
//         totalCount: totalFreelancers,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving pending freelancers" });
//   }
// };

// const deleteJoinFreelancerRequest = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (user.role !== "Admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied: Admins only can delete requests" });
//     }
//     const requestId = req.params.id;
//     const deletedRequest = await joinFreelancer.findByIdAndDelete(requestId);

//     if (!deletedRequest) {
//       return res.status(404).json({ message: "Join request not found" });
//     }

//     res.status(200).json({ message: "Join request deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting join request" });
//   }
// };

// const getSingleJoinRequest = async (req, res) => {
//   try {
//     const requestId = req.params.id;
//     const joinRequest = await joinFreelancer.findById(requestId);

//     if (!joinRequest) {
//       return res.status(404).json({ message: "Join request not found" });
//     }

//     res.status(200).json({ data: joinRequest });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving join request" });
//   }
// };

// const updateWorkStatus = async (req, res) => {
//   try {
//     const { workId, status } = req.body;

//     if (!["تحت المراجعة", "تم الموافقة", "تم رفضه"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const user = req.user;

//     if (user.role !== "Admin") {
//       return res
//         .status(403)
//         .json({ message: "Only Admin can update work status" });
//     }

//     const work = await joinFreelancer.findById(workId);
//     if (!work) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     work.status = status;
//     await work.save();

//     res.status(200).json({
//       message: `work status updated to ${status}`,
//       work,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const updateJoinRequest = async (req, res) => {
//   try {
//     const requestId = req.params.id;
//     if (req.user.role !== "Admin") {
//       return res.status(403).json({
//         message: "Only admins can update the join request",
//       });
//     }

//     const joinRequest = await joinFreelancer.findById(requestId);
//     if (!joinRequest) {
//       return res.status(404).json({
//         message: "Join request not found",
//       });
//     }

//     const updatedData = {
//       fullName: req.body.fullName || joinRequest.fullName,
//       email: req.body.email || joinRequest.email,
//       phoneNumber: req.body.phoneNumber || joinRequest.phoneNumber,
//       idNumber: req.body.idNumber || joinRequest.idNumber,
//       city: req.body.city || joinRequest.city,
//       englishLevel: req.body.englishLevel || joinRequest.englishLevel,
//       title: req.body.title || joinRequest.title,
//       country: req.body.country || joinRequest.country,
//       jobTitle: req.body.jobTitle || joinRequest.jobTitle,
//       degree: req.body.degree || joinRequest.degree,
//       graduationYear: req.body.graduationYear || joinRequest.graduationYear,
//       willingToRelocate:
//         req.body.willingToRelocate || joinRequest.willingToRelocate,
//       canWorkRemotely: req.body.canWorkRemotely || joinRequest.canWorkRemotely,
//       maritalStatus: req.body.maritalStatus || joinRequest.maritalStatus,
//       bio: req.body.bio || joinRequest.bio,
//       status: req.body.status || joinRequest.status,
//     };
//     const updatedRequest = await joinFreelancer.findByIdAndUpdate(
//       requestId,
//       updatedData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     res.status(200).json({
//       message: "Join request updated successfully",
//       updatedRequest,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// const exportTableToCsv = async (req, res) => {
//   try {
//     const freelancers = await joinFreelancer.find({ status: "تم الموافقة" });

//     const headers = [
//       "createdAt", 
//       "title",
//       "fullName",
//       "phoneNumber",
//       "email",
//       "city",
//       "jobTitle",
//       "degree",
//       "graduationYear",
//       "willingToRelocate",
//       "cv",
//       "idNumber",
//       "englishLevel",
//       "country",
//       "canWorkRemotely",
//       "maritalStatus",
//       "status"
//     ];

//     const rows = freelancers.map((freelancer) => ({
//       createdAt: freelancer.createdAt ? 
//         freelancer.createdAt.toISOString().split('T')[0] : "", 
//       title: freelancer.title,
//       fullName: freelancer.fullName,
//       phoneNumber: freelancer.phoneNumber,
//       email: freelancer.email,
//       city: freelancer.city,
//       jobTitle: freelancer.jobTitle,
//       degree: freelancer.degree,
//       graduationYear: freelancer.graduationYear,
//       willingToRelocate: freelancer.willingToRelocate,
//       cv: freelancer.cv ? `${req.protocol}://${req.headers.host}/uploads/cvs/${freelancer.cv}` : "",
//       idNumber: freelancer.idNumber,
//       englishLevel: freelancer.englishLevel,
//       country: freelancer.country,
//       canWorkRemotely: freelancer.canWorkRemotely,
//       maritalStatus: freelancer.maritalStatus,
//       status: freelancer.status
//     }));

//     const csv = json2csv(rows, { header: true, fields: headers });

//     const exportDir = path.join(__dirname, "../exports");
//     const filePath = path.join(exportDir, "freelancers.csv");

//     if (!fs.existsSync(exportDir)) {
//       fs.mkdirSync(exportDir, { recursive: true });
//     }

//     fs.writeFileSync(filePath, "\uFEFF" + csv, "utf-8");

//     const downloadLink = `${req.protocol}://${req.headers.host}/api/work/download/freelancers.csv`;

//     res.status(200).json({
//       message: "CSV file created successfully",
//       downloadLink: downloadLink
//     });
//   } catch (error) {
//     console.error("Error exporting to CSV:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// const insertSheet = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file found" });
//     }

//     const filePath = path.join(__dirname, "../userImages", req.file.filename);

//     const excelData = excelToJson({
//       sourceFile: filePath,
//       header: {
//         rows: 1,
//       },
//       columnToKey: {
//         A: "createdAt",
//         B: "title",
//         C: "fullName",
//         D: "phoneNumber",
//         E: "email",
//         F: "city",
//         G: "jobTitle",
//         H: "degree",
//         I: "graduationYear",
//         J: "willingToRelocate",
//         K: "cv",
//         L: "idNumber",
//         M: "englishLevel",
//         N: "canWorkRemotely",
//       },
//     });

//     let arrayToInsert = [];

//     for (var i = 0; i < excelData.data.length; i++) {
//       // تحقق من الحقول المطلوبة
//       if (
//         !excelData.data[i]["fullName"] ||
//         !excelData.data[i]["email"] ||
//         !excelData.data[i]["phoneNumber"] ||
//         !excelData.data[i]["idNumber"] ||
//         !excelData.data[i]["city"] ||
//         !excelData.data[i]["englishLevel"] ||
//         !excelData.data[i]["title"] ||
//         !excelData.data[i]["degree"] ||
//         !excelData.data[i]["graduationYear"] ||
//         !excelData.data[i]["cv"]
//       ) {
//         console.log("Missing required fields in row", i);
//         continue;
//       }

//       // تحقق مما إذا كانت graduationYear نصًا قبل استخدام match
//       const graduationYearValue = excelData.data[i]["graduationYear"];
//       let graduationYear = null;

//       if (typeof graduationYearValue === "string") {
//         // استخراج السنة فقط من النص
//         const match = graduationYearValue.match(/\d{4}/);
//         graduationYear = match ? parseInt(match[0]) : null;
//       } else if (typeof graduationYearValue === "number") {
//         // إذا كانت القيمة عددًا بالفعل
//         graduationYear = graduationYearValue;
//       }

//       var singleRow = {
//         createdAt: excelData.data[i]["createdAt"],
//         title: excelData.data[i]["title"],
//         fullName: excelData.data[i]["fullName"],
//         phoneNumber: excelData.data[i]["phoneNumber"],
//         email: excelData.data[i]["email"],
//         city: excelData.data[i]["city"],
//         jobTitle: excelData.data[i]["jobTitle"],
//         degree: excelData.data[i]["degree"],
//         graduationYear: graduationYear, // استخدام القيمة المستخرجة
//         willingToRelocate: excelData.data[i]["willingToRelocate"],
//         cv: excelData.data[i]["cv"],
//         idNumber: excelData.data[i]["idNumber"],
//         englishLevel: excelData.data[i]["englishLevel"],
//         canWorkRemotely: excelData.data[i]["canWorkRemotely"],
//       };

//       arrayToInsert.push(singleRow);
//     }

//     if (arrayToInsert.length > 0) {
//       const data = await joinFreelancer.insertMany(arrayToInsert);
//       await fs.unlink(filePath);
//       res.status(201).json({ message: "success", data });
//     } else {
//       res.status(400).json({ message: "No valid data to insert" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json("Sorry, something went wrong...");
//   }
// };

// module.exports = {
//   applyToWork,
//   getApprovedFreelancers,
//   getPendingFreelancers,
//   deleteJoinFreelancerRequest,
//   getSingleJoinRequest,
//   updateWorkStatus,
//   updateJoinRequest,
//   exportTableToCsv,
//   insertSheet,
// };
const joinFreelancer = require("../models/joinFreelancerModel");
const User = require("../models/userModel");
// const { Parser } = require('json2csv');
const json2csv = require("json2csv").parse;
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
//const fs = require("fs-extra");
const applyToWork = async (req, res) => {
  try {
    const {
      country,
      bio,
      fullName,
      email,
      phoneNumber,
      idNumber,
      city,
      englishLevel,
      title,
      jobTitle,
      degree,
      graduationYear,
      willingToRelocate,
      canWorkRemotely,
      maritalStatus,
    } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "Freelancer" && req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Freelancers or Admins can apply" });
    }
    let cvFilename =
      req.files && req.files.cv ? req.files.cv[0].filename : undefined;
    let profilePictureFilename =
      req.files && req.files.profilePicture
        ? req.files.profilePicture[0].filename
        : undefined;

    const status = req.user.role === "Admin" ? "تم الموافقة" : "تحت المراجعة";

    const applicationForWork = new joinFreelancer({
      fullName,
      email,
      phoneNumber,
      idNumber,
      city,
      englishLevel,
      title,
      bio,
      country,
      jobTitle,
      degree,
      graduationYear,
      willingToRelocate,
      canWorkRemotely,
      maritalStatus,
      profilePicture: profilePictureFilename,
      cv: cvFilename,
      status,
    });

    await applicationForWork.save();

    res.status(201).json({
      message: "Application submitted successfully",
      applicationForWork,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getApprovedFreelancers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    if (
      page < 1 ||
      limit < 1 ||
      !Number.isInteger(page) ||
      !Number.isInteger(limit)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameters" });
    }

    const skip = (page - 1) * limit;
    // const filter = { status: "تم الموافقة" };
    const filter = {};
    if (
      req.query.currentJobTitleAr &&
      req.query.currentJobTitleAr !== "null" &&
      req.query.currentJobTitleAr !== "undefined" &&
      req.query.currentJobTitleAr.trim() !== ""
    ) {
      filter.currentJobTitleAr = req.query.currentJobTitleAr;
    }
    if (
      req.query.specialtyNameAr &&
      req.query.specialtyNameAr !== "null" &&
      req.query.specialtyNameAr !== "undefined" &&
      req.query.specialtyNameAr.trim() !== ""
    ) {
      filter.specialtyNameAr = req.query.specialtyNameAr;
    }
    if (
      req.query.qualification &&
      req.query.qualification !== "null" &&
      req.query.qualification !== "undefined" &&
      req.query.qualification.trim() !== ""
    ) {
      filter.qualification = req.query.qualification;
    }
    if (
      req.query.currentlyEmployed &&
      req.query.currentlyEmployed !== "null" &&
      req.query.currentlyEmployed !== "undefined" &&
      req.query.currentlyEmployed.trim() !== ""
    ) {
      filter.currentlyEmployed = req.query.currentlyEmployed;
    }
    if (
      req.query.gender &&
      req.query.gender !== "null" &&
      req.query.gender !== "undefined" &&
      req.query.gender.trim() !== ""
    ) {
      filter.gender = req.query.gender;
    }
    if (
      req.query.nationality &&
      req.query.nationality !== "null" &&
      req.query.nationality !== "undefined" &&
      req.query.nationality.trim() !== ""
    ) {
      filter.nationality = req.query.nationality;
    }
    if (
      req.query.totalExperience &&
      req.query.totalExperience !== "null" &&
      req.query.totalExperience !== "undefined" &&
      req.query.totalExperience.trim() !== ""
    ) {
      filter.totalExperience = req.query.totalExperience;
    }
    // if (
    //   req.query.maritalStatus &&
    //   req.query.maritalStatus !== "null" &&
    //   req.query.maritalStatus !== "undefined" &&
    //   req.query.maritalStatus.trim() !== ""
    // ) {
    //   filter.maritalStatus = req.query.maritalStatus;
    // }
    const freelancers = await joinFreelancer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalFreelancers = await joinFreelancer.countDocuments(filter);

    res.status(200).json({
      data: freelancers,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalFreelancers / limit) || 1,
        totalCount: totalFreelancers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving approved freelancers" });
  }
};

const getPendingFreelancers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    if (
      page < 1 ||
      limit < 1 ||
      !Number.isInteger(page) ||
      !Number.isInteger(limit)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameters" });
    }

    const skip = (page - 1) * limit;
    const filter = { status: "تحت المراجعة" };
    if (
      req.query.jobTitle &&
      req.query.jobTitle !== "null" &&
      req.query.jobTitle !== "undefined" &&
      req.query.jobTitle.trim() !== ""
    ) {
      filter.jobTitle = req.query.jobTitle;
    }
    if (
      req.query.city &&
      req.query.city !== "null" &&
      req.query.city !== "undefined" &&
      req.query.city.trim() !== ""
    ) {
      filter.city = req.query.city;
    }
    if (
      req.query.country &&
      req.query.country !== "null" &&
      req.query.country !== "undefined" &&
      req.query.country.trim() !== ""
    ) {
      filter.country = req.query.country;
    }
    if (
      req.query.englishLevel &&
      req.query.englishLevel !== "null" &&
      req.query.englishLevel !== "undefined" &&
      req.query.englishLevel.trim() !== ""
    ) {
      filter.englishLevel = req.query.englishLevel;
    }
    if (
      req.query.degree &&
      req.query.degree !== "null" &&
      req.query.degree !== "undefined" &&
      req.query.degree.trim() !== ""
    ) {
      filter.degree = req.query.degree;
    }
    if (
      req.query.willingToRelocate &&
      req.query.willingToRelocate !== "null" &&
      req.query.willingToRelocate !== "undefined" &&
      req.query.willingToRelocate.trim() !== ""
    ) {
      filter.willingToRelocate = req.query.willingToRelocate;
    }
    if (
      req.query.canWorkRemotely &&
      req.query.canWorkRemotely !== "null" &&
      req.query.canWorkRemotely !== "undefined" &&
      req.query.canWorkRemotely.trim() !== ""
    ) {
      filter.canWorkRemotely = req.query.canWorkRemotely;
    }
    if (
      req.query.maritalStatus &&
      req.query.maritalStatus !== "null" &&
      req.query.maritalStatus !== "undefined" &&
      req.query.maritalStatus.trim() !== ""
    ) {
      filter.maritalStatus = req.query.maritalStatus;
    }

    const freelancers = await joinFreelancer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalFreelancers = await joinFreelancer.countDocuments(filter);

    const nextPage =
      page < Math.ceil(totalFreelancers / limit) ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      data: freelancers,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalFreelancers / limit) || 1,
        totalCount: totalFreelancers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pending freelancers" });
  }
};

const deleteJoinFreelancerRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Admins only can delete requests" });
    }
    const requestId = req.params.id;
    const deletedRequest = await joinFreelancer.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    res.status(200).json({ message: "Join request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting join request" });
  }
};

const getSingleJoinRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const joinRequest = await joinFreelancer.findById(requestId);

    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    res.status(200).json({ data: joinRequest });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving join request" });
  }
};

const updateWorkStatus = async (req, res) => {
  try {
    const { workId, status } = req.body;

    if (!["تحت المراجعة", "تم الموافقة", "تم رفضه"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = req.user;

    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admin can update work status" });
    }

    const work = await joinFreelancer.findById(workId);
    if (!work) {
      return res.status(404).json({ message: "Job not found" });
    }

    work.status = status;
    await work.save();

    res.status(200).json({
      message: `work status updated to ${status}`,
      work,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateJoinRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only admins can update the join request",
      });
    }

    const joinRequest = await joinFreelancer.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({
        message: "Join request not found",
      });
    }

    const updatedData = {
      fullName: req.body.fullName || joinRequest.fullName,
      email: req.body.email || joinRequest.email,
      phoneNumber: req.body.phoneNumber || joinRequest.phoneNumber,
      idNumber: req.body.idNumber || joinRequest.idNumber,
      city: req.body.city || joinRequest.city,
      englishLevel: req.body.englishLevel || joinRequest.englishLevel,
      title: req.body.title || joinRequest.title,
      country: req.body.country || joinRequest.country,
      jobTitle: req.body.jobTitle || joinRequest.jobTitle,
      degree: req.body.degree || joinRequest.degree,
      graduationYear: req.body.graduationYear || joinRequest.graduationYear,
      willingToRelocate:
        req.body.willingToRelocate || joinRequest.willingToRelocate,
      canWorkRemotely: req.body.canWorkRemotely || joinRequest.canWorkRemotely,
      maritalStatus: req.body.maritalStatus || joinRequest.maritalStatus,
      bio: req.body.bio || joinRequest.bio,
      status: req.body.status || joinRequest.status,
    };
    const updatedRequest = await joinFreelancer.findByIdAndUpdate(
      requestId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "Join request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const exportTableToCsv = async (req, res) => {
  try {
    const freelancers = await joinFreelancer.find();

    const headers = [
      "currentJobTitleEn",
      "currentJobTitleAr",
      "specialtyNameAr",
      "qualification",
      "universityName",
      "specialtyExperience",
      "totalExperience",
      "fullName",
      "nationality",
      "email",
      "phoneNumber",
      "gender",
      "currentlyEmployed",
      "skills",
      "resume"
    ];

    const rows = freelancers.map((freelancer) => ({
      fullName: freelancer?.fullName || "",
      currentJobTitleEn: freelancer?.currentJobTitleEn || "",
      currentJobTitleAr: freelancer?.currentJobTitleAr || "",
      specialtyNameAr: freelancer?.specialtyNameAr || "",
      phoneNumber: freelancer?.phoneNumber || "",
      email: freelancer?.email || "",
      specialtyExperience: freelancer?.specialtyExperience || "",
      totalExperience: freelancer?.totalExperience || "",
      qualification: freelancer?.qualification || "",
      nationality: freelancer?.nationality || "",
      gender: freelancer?.gender || "",
      currentlyEmployed: freelancer?.currentlyEmployed || "",
      skills: freelancer?.skills || "",
      universityName: freelancer?.universityName || "",
      resume: freelancer?.resume || "",

      // createdAt: freelancer.createdAt
      //   ? freelancer.createdAt.toISOString().split("T")[0]
      //   : "",
      // title: freelancer.title,
      // fullName: freelancer.fullName,
      // phoneNumber: freelancer.phoneNumber,
      // email: freelancer.email,
      // city: freelancer.city,
      // jobTitle: freelancer.jobTitle,
      // degree: freelancer.degree,
      // graduationYear: freelancer.graduationYear,
      // willingToRelocate: freelancer.willingToRelocate,
      // cv: freelancer.cv
      //   ? c`
      //   : "",
      // idNumber: freelancer.idNumber,
      // englishLevel: freelancer.englishLevel,
      // country: freelancer.country,
      // canWorkRemotely: freelancer.canWorkRemotely,
      // maritalStatus: freelancer.maritalStatus,
      // status: freelancer.status,
    }));
    console.log("rows", rows);
    const csv = json2csv(rows, { header: true, fields: headers });

    const exportDir = path.join(__dirname, "../exports");
    const filePath = path.join(exportDir, "freelancers.csv");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    fs.writeFileSync(filePath, "\uFEFF" + csv, "utf-8");

    const downloadLink = `https://${req.headers.host}/api/work/download/freelancers.csv`;

    res.status(200).json({
      message: "CSV file created successfully",
      downloadLink: downloadLink,
    });
  } catch (error) {
    console.error("Error exporting to CSV:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};




// const insertSheet = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file found" });
//     }

//     const filePath = path.join(__dirname, "../userImages", req.file.filename);

//     const excelData = excelToJson({
//       sourceFile: filePath,
//       header: {
//         rows: 1,
//       },
//       columnToKey: {
//         A: "title",
//         B: "fullName",
//         C: "phoneNumber",
//         D: "email",f
//         E: "city",
//         F: "jobTitle",
//         G: "degree",
//         H: "graduationYear",
//         I: "willingToRelocate",
//         J: "cv",
//         K: "idNumber",
//         L: "englishLevel",
//         M: "canWorkRemotely",
//       },
//     });

//     // عرض كامل للبيانات القادمة من ملف الإكسل
//    // console.log("Excel Data:", excelData);

//     // افحص اسم الورقة داخل الملف
//     const sheetName = Object.keys(excelData)[0];
//    // console.log("Sheet Name:", sheetName);
//     const sheetData = excelData[sheetName];

//     // تأكد من أن البيانات موجودة
//     if (!sheetData || sheetData.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No data found in the Excel file" });
//     }

//     let arrayToInsert = [];

//     for (var i = 0; i < sheetData.length; i++) {
//       // تحقق من graduationYear
//       const graduationYearValue = sheetData[i]["graduationYear"];
//       let graduationYear = null;

//       if (typeof graduationYearValue === "string") {
//         const match = graduationYearValue.match(/\d{4}/);
//         graduationYear = match ? parseInt(match[0]) : null;
//       } else if (typeof graduationYearValue === "number") {
//         graduationYear = graduationYearValue;
//       }

//       var singleRow = {
//         title: sheetData[i]["title"],
//         fullName: sheetData[i]["fullName"],
//         phoneNumber: sheetData[i]["phoneNumber"],
//         email: sheetData[i]["email"],
//         city: sheetData[i]["city"],
//         jobTitle: sheetData[i]["jobTitle"],
//         degree: sheetData[i]["degree"],
//         graduationYear: graduationYear,
//         willingToRelocate: sheetData[i]["willingToRelocate"],
//         cv: sheetData[i]["cv"],
//         idNumber: sheetData[i]["idNumber"],
//         englishLevel: sheetData[i]["englishLevel"],
//         canWorkRemotely: sheetData[i]["canWorkRemotely"],
//         status: "تم الموافقة", // إضافة حالة "تمت الموافقة"
//       };

//       arrayToInsert.push(singleRow);
//     }

//     if (arrayToInsert.length > 0) {
//       const data = await joinFreelancer.insertMany(arrayToInsert);
//       fs.unlink(filePath, (err) => { // حذف الملف بعد الإدخال
//         if (err) console.error("Error deleting file:", err);
//       });
//       res.status(201).json({ message: "success", data });
//     } else {
//       res.status(400).json({ message: "No valid data to insert" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({message:"Sorry, something went wrong..."});
//   }
// };

// const insertSheet = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file found" });
//     }

//     const filePath = path.join(__dirname, "../userImages", req.file.filename);

//     const excelData = excelToJson({
//       sourceFile: filePath,
//       header: { rows: 1 },
//       columnToKey: {
//         A: "title",
//         B: "fullName",
//         C: "phoneNumber",
//         D: "email",
//         E: "city",
//         F: "jobTitle",
//         G: "degree",
//         H: "graduationYear",
//         I: "willingToRelocate",
//         J: "cv",
//         K: "idNumber",
//         L: "englishLevel",
//         M: "canWorkRemotely",
//       },
//     });

//     const sheetName = Object.keys(excelData)[0];
//     const sheetData = excelData[sheetName];

//     if (!sheetData || sheetData.length === 0) {
//       return res.status(400).json({ message: "No data found in the Excel file" });
//     }

//     for (const row of sheetData) {
//       const graduationYearValue = row["graduationYear"];
//       let graduationYear = null;

//       if (typeof graduationYearValue === "string") {
//         const match = graduationYearValue.match(/\d{4}/);
//         graduationYear = match ? parseInt(match[0]) : null;
//       } else if (typeof graduationYearValue === "number") {
//         graduationYear = graduationYearValue;
//       }

//       const record = {
//         title: row["title"],
//         fullName: row["fullName"],
//         phoneNumber: row["phoneNumber"],
//         email: row["email"],
//         city: row["city"],
//         jobTitle: row["jobTitle"],
//         degree: row["degree"],
//         graduationYear,
//         willingToRelocate: row["willingToRelocate"],
//         cv: row["cv"],
//         idNumber: row["idNumber"],
//         englishLevel: row["englishLevel"],
//         canWorkRemotely: row["canWorkRemotely"],
//         status: "تم الموافقة",
//       };

//       // Perform upsert for each record
//       await JoinFreelancer.updateOne(
//         {
//           $or: [
//             { phoneNumber: record.phoneNumber },
//             { email: record.email }
//           ]
//         },
//         { $set: record },
//         { upsert: true }
//       );
//     }

//     fs.unlink(filePath, (err) => {
//       if (err) console.error("Error deleting file:", err);
//     });

//     res.status(201).json({ message: "Data processed successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Sorry, something went wrong..." });
//   }
// };

const deduplicateEmails = (data) => {
  const seenEmails = new Set();
  return data.filter((row) => {
    const email = row["email"]; // Accessing email using bracket notation
    if (seenEmails.has(email)) {
      return false; // Exclude if email is already in the set
    }
    seenEmails.add(email); // Add email to the set
    return true; // Include if it's the first time
  });
};



const insertSheet = async (req, res) => {
  try {
    // console.log("hhhhh");
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    }

    const filePath = path.join(__dirname, "../userImages", req.file.filename);
    console.log("hhhhh", filePath);

    // const excelData = excelToJson({
    //   sourceFile: filePath,
    //   header: { rows: 1 },
    //   columnToKey: {
    //     A: "fullName",
    //     B: "currentJobTitleEn",
    //     C: "currentJobTitleAr",
    //     D: "specialtyNameAr",
    //     E: "phoneNumber",
    //     F: "email",
    //     G: "qualification",
    //     H: "universityName",
    //     I: "specaialtyExperience",
    //     J: "totalExperience",
    //     K: "nationality",
    //     L: "gender",
    //     M: "currentlyEmployed",
    //     O: "resume"
    //   },
    // });

    // const sheetName = Object.keys(excelData)[0];
    // const sheetData = excelData[sheetName];
    // console.log("sheetData", sheetData)

    const excelData = excelToJson({
      sourceFile: filePath,
      header: { rows: 1 }, // Skip the first row as headers
      columnToKey: {
        H: "fullName",
        A: "currentJobTitleEn",
        B: "currentJobTitleAr",
        C: "specialtyNameAr",
        K: "phoneNumber",
        J: "email",
        F: "specialtyExperience",
        G: "totalExperience",
        D: "qualification",
        I: "nationality",
        L: "gender",
        M: "currentlyEmployed",
        N: "skills",
        E: "universityName",
        O: "resume",
      },
    });
    console.log("Processed Data:", excelData.file?.length);
    console.log("Processed Data:", excelData);

    const sheetName = Object.keys(excelData);
    const sheetData = excelData[sheetName];

    // const sheetNames = Object.keys(excelData);
    console.log("sheetNames Data:", sheetData);

    // if (sheetNames.length > 0) {
    //   const rawSheetData = excelData[sheetNames[0]];
    //   console.log("Raw Sheet Data:", rawSheetData);
    // } else {
    //   console.log("No sheets found.");
    // }


    if (!sheetData || sheetData.length === 0) {
      return res.status(400).json({ message: "No data found in the Excel file" });
    }

    const deduplicatedData = deduplicateEmails(sheetData);
    console.log("Deduplicated Data:", deduplicatedData);

    const bulkOps = deduplicatedData.map(row => {

      const record = {
        fullName: row["fullName"],
        currentJobTitleEn: row["currentJobTitleEn"],
        currentJobTitleAr: row["currentJobTitleAr"],
        specialtyNameAr: row["specialtyNameAr"],
        qualification: row["qualification"],
        universityName: row["universityName"],
        specialtyExperience: row["specialtyExperience"],
        totalExperience: row["totalExperience"],
        nationality: row["nationality"],
        email: row["email"],
        phoneNumber: row["phoneNumber"],
        gender: row["gender"],
        currentlyEmployed: row["currentlyEmployed"],
        skills: row["skills"],
        resume: row["resume"],
      };


      // return {
      //   insertOne: {
      //     document: record,
      //   },
      // };

      return {
        updateOne: {
           filter: { $or: [{ phoneNumber: record.phoneNumber }, { email: record.email }] },
          update: { $set: record },
          upsert: true,
        }
      };
    });
    console.log("record", bulkOps.length)

    // Execute all operations in bulk
    try {
      await joinFreelancer.bulkWrite(bulkOps, { ordered: false });

    } catch (error) {
      console.error('Bulk write error:', error.message, error.writeErrors);

    }

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.status(201).json({ message: "Data processed successfully", count: bulkOps.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sorry, something went wrong..." });
  }
};


module.exports = {
  applyToWork,
  getApprovedFreelancers,
  getPendingFreelancers,
  deleteJoinFreelancerRequest,
  getSingleJoinRequest,
  updateWorkStatus,
  updateJoinRequest,
  exportTableToCsv,
  insertSheet,
};