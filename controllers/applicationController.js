const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");

// apply job
const applyForJob = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const { jobId, fullName, phone } = req.body;
    if (!freelancerId || !jobId || !fullName) {
      return res.status(400).json({
        message: "All fields (freelancerId, jobId, fullName) are required",
      });
    }
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== "Freelancer") {
      return res.status(400).json({ message: "User is not a freelancer" });
    }
    const existingApplication = await Application.findOne({
      freelancer: freelancerId,
      job: jobId,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "لقد قمت بالتقديم على هذه الوظيفة من قبل." });
    }
    const cvPath = req.file ? req.file.filename : null;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const creator = await User.findById(job.createdBy);
    if (!creator || creator.role !== "Client") {
      return res.status(400).json({ message: "Job creator is not a client" });
    }

    const application = new Application({
      freelancer: freelancerId,
      job: jobId,
      fullName: fullName,
      phone: phone,
      cv: cvPath,
    });

    await application.save();
    job.applications.push(application._id);
    await job.save();
    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
//delete application herSelf
const deleteApplicationForFriendApplication = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const { applicationId } = req.params;
    const application = await Application.findOne({
      _id: applicationId,
      freelancer: freelancerId,
    });

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found or you don't have permission to delete it",
      });
    }

    await Application.findByIdAndDelete(applicationId);
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId },
    });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
//delete application for friend jop
const deleteApplicationForFriendJop = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "application is not found",
      });
    }
    await Application.findByIdAndDelete(applicationId);
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId },
    });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getMyAppliedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }
    const skip = (page - 1) * limit;
    const freelancerId = req.user._id;
    const applications = await Application.find({
      freelancer: freelancerId,
    })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "companyName companyLogo email",
        },
        select: "description",
      })
      .sort({ createdAt: -1 })
      .select("job _id")
      .skip(skip)
      .limit(limit);
    const totalApplycation = await Application.countDocuments({
      freelancer: freelancerId,
    });

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found that you applied for" });
    }

    // const jobs = applications.map((app) => app.job);

    res.status(200).json({
      data: applications,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalApplycation / limit) || 1,
        totalCount: totalApplycation,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyForJob,
  deleteApplicationForFriendApplication,
  getMyAppliedJobs,
  deleteApplicationForFriendJop,
};
