const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const emailingjobform = require("../utils/sendJobFormEmail");
const JoinFreelaner = require('../models/joinFreelancerModel')

// Function to export applications to CSV
// async function exportApplicationsToCSV(jobId) {
//   try {
//     // Step 1: Find the job by its ID and populate applications
//     const job = await Job.findById(jobId)
//       .populate({
//         path: 'applications', // Populate applications to get related documents
//         select: 'resume status appliedDate' // Only select relevant fields
//       });

//     if (!job) {
//       throw new Error('Job not found');
//     }

//     // Step 2: Extract application data
//     const applicationsData = job.applications.map(app => ({
//       resume: app.resume,
//       status: app.status,
//       applicationDate: app.appliedDate
//     }));

//     // Step 3: Convert JSON data to CSV format
//     const json2csvParser = new Parser({ fields: ['resume', 'status', 'applicationDate'] });
//     const csvData = json2csvParser.parse(applicationsData);

//     // Step 4: Write CSV data to a file in a temporary directory
//     const filePath = path.join(__dirname, `job_${jobId}_applications.csv`);
//     fs.writeFileSync(filePath, csvData);

//     return filePath; // Return the file path for download
//   } catch (error) {
//     throw new Error('Error exporting applications to CSV: ' + error.message);
//   }
// }

////email emailJobForm
const emailJobForm = async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);


    const cvPath = req.file ? req.file.filename : null;
    const options = { ...data, resume: `https://backend.ershad-sa.com/userImages//${cvPath}` };
    
    const joinFreelaner = JoinFreelaner(options);
    await joinFreelaner.save();
    await emailingjobform(options);


    res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.log("erorrr", error);

    res.status(500).json({ error: error.message });

  }
};

// apply job
const applyForJob = async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);

    const { job, phoneNumber } = data;

    const existingApplication = await Application.findOne({
      job: job,
      phoneNumber: phoneNumber,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "لقد قمت بالتقديم على هذه الوظيفة من قبل." });
    }
    const cvPath = req.file ? req.file.filename : null;
    const joboffer = await Job.findById(job);
    if (!joboffer) {
      return res.status(404).json({ message: "Job not found" });
    }


    const application = new Application({
      ...data,
      resume: cvPath
    }

    );
    console.log("application", application);
    await application.save();
    joboffer.applications.push(application._id);
    await joboffer.save();
    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.log("errrrrrrrrrrrrr", error);

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
    console.log("errrrrrrrrrrrrr", error);
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
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyForJob,
  deleteApplicationForFriendApplication,
  getMyAppliedJobs,
  deleteApplicationForFriendJop,
  emailJobForm
};
