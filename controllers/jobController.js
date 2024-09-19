const User = require("../models/userModel");
const Job = require("../models/jobModel");
const mongoose = require("mongoose");
//create job
const createJob = async (req, res) => {
  try {
    const clientId = req.user._id;
    const user = await User.findById(clientId);

    if (user.role !== "Client") {
      return res.status(403).json({ message: "Only clients can add jobs" });
    }

    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const job = new Job({
      description,
      createdBy: user._id,
    });

    await job.save();

    const populatedJob = await Job.findById(job._id).populate({
      path: "createdBy",
      select: "companyName companyLogo email",
    });

    res
      .status(201)
      .json({ message: "Job added successfully", job: populatedJob });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Error adding job", error: error.message });
  }
};
//get all jobs
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid limit" });
    }

    const jobs = await Job.find()
      .populate({
        path: "createdBy",
        select: "companyName companyLogo email address",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalJops = await Job.countDocuments();
    res.status(200).json({
      data: jobs,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalJops / limit) || 1,
        totalCount: totalJops,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//get all jobs for client privete dash
const getJobsForClientDash = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }
    const skip = (page - 1) * limit;
    const clientId = req.user._id;
    const user = await User.findById(clientId);
    if (user.role !== "Client") {
      return res
        .status(403)
        .json({ message: "Only clients can access their jobs" });
    }

    const jobs = await Job.find({
      createdBy: clientId,
      status: "تم الموافقة",
    })
      .populate("applications")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalJops = await Job.countDocuments({
      createdBy: clientId,
      status: "تم الموافقة",
    });

    res.status(200).json({
      message: "Successfully fetched client jobs",
      data: jobs,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalJops / limit) || 1, // Calculate total pages
        totalCount: totalJops, // Total number of jops
      },
    });
  } catch (error) {
    console.error("Error fetching client jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching client jobs", error: error.message });
  }
};
//get all jobs for client public
const getJobsForClientPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }
    const skip = (page - 1) * limit;
    const clientId = req.user._id;
    const user = await User.findById(clientId);
    if (user.role !== "Client") {
      return res
        .status(403)
        .json({ message: "Only clients can access their jobs" });
    }

    const jobs = await Job.find({
      createdBy: clientId,
      status: "تم الموافقة",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalJops = await Job.countDocuments({
      createdBy: clientId,
      status: "تم الموافقة",
    });

    res.status(200).json({
      message: "Successfully fetched client jobs",
      data: jobs,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalJops / limit) || 1, // Calculate total pages
        totalCount: totalJops, // Total number of jops
      },
    });
  } catch (error) {
    console.error("Error fetching client jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching client jobs", error: error.message });
  }
};
// delete job
const deleteJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "Admin" &&
      job.createdBy.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//save job
const saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: "createdBy",
        select: "companyName email companyLogo",
      })
      .select("description createdBy");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(userId);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({ message: "Job saved successfully", savedJobs: job });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//unsave job
const unsaveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId).select("_id");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(userId);

    const jobIndex = user.savedJobs.indexOf(jobId);
    if (jobIndex !== -1) {
      user.savedJobs.splice(jobIndex, 1);
      await user.save();
    }

    res
      .status(200)
      .json({ message: "Job unsaved successfully", savedJobs: job });
  } catch (error) {
    console.error("Error unsaving job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get single job
const getSingleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId).populate({
      path: "createdBy",
      select: "companyName email address contact",
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ data: job });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update job status
const updateJobStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;

    if (!["تحت المراجعة", "تم الموافقة", "تم رفضه"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = req.user;

    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admin can update job status" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      message: `Job status updated to ${status}`,
      job,
    });
  } catch (error) {
    console.error("Error updating job status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// get Abrove Jop
const getActivatedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid limit" });
    }

    const activatedJobs = await Job.find({ status: "تم الموافقة" })
      .populate("createdBy", "companyName companyLogo email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const jobsWithApplicationCount = activatedJobs.map((job) => ({
      ...job,
      applicationCount: job.applications.length,
    }));
    const totalJops = await Job.countDocuments({ status: "تم الموافقة" });
    res.status(200).json({
      data: jobsWithApplicationCount,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalJops / limit) || 1,
        totalCount: totalJops,
      },
    });
  } catch (error) {
    console.error("Error retrieving activated jobs:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// get saved Jop
const getSavedJobsForUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid limit" });
    }

    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userIdOnly = await User.findById(userId);
    const user = await User.findById(userId)
      .populate({
        path: "savedJobs",
        select: "description status createdBy",
        populate: {
          path: "createdBy",
          select: "companyName email companyLogo",
        },
      })
      .sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const savedJobs = user.savedJobs.slice(startIndex, endIndex);

    return res.status(200).json({
      message: "Saved jobs fetched successfully",
      data: savedJobs,
      idOnly: userIdOnly.savedJobs,
      total: user.savedJobs.length,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching saved jobs" });
  }
};

//get all jobs for specific client
const getJobsByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const jobs = await Job.find({ createdBy: clientId, status: "تم الموافقة" })
      .populate("createdBy", "companyName email companyLogo")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this client." });
    }
    const totalJops = await Job.countDocuments({ createdBy: clientId });
    res.status(200).json({
      data: jobs,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalJops / limit) || 1,
        totalCount: totalJops,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs for client", error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  saveJob,
  unsaveJob,
  getJobsForClientDash,
  getJobsForClientPublic,
  deleteJob,
  getSingleJob,
  updateJobStatus,
  getActivatedJobs,
  getSavedJobsForUser,
  getJobsByClient,
};
