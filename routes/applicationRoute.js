const express = require("express");
const path = require("path");
const multer = require("multer");
const { Parser } = require('json2csv');

const fs = require("fs");
const { auth } = require("../middlewares/auth.js");
const {
  applyForJob,
  emailJobForm,
  deleteApplicationForFriendApplication,
  deleteApplicationForFriendJop,
  getMyAppliedJobs,
} = require("../controllers/applicationController.js");
const Job = require("../models/jobModel");
const mongoose = require("mongoose");
const { route } = require("./userRoute.js");
//upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../userImages");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

//apply job
// router.post("/apply", auth, upload.single("cv"), applyForJob);
router.post("/apply", upload.single("resume"), applyForJob);
// upload.single("resume"), 
//delete job
router.delete(
  "/deleteApplicationForFriendApplication/:applicationId",
  auth,
  deleteApplicationForFriendApplication
);
// deleteApplicationForFriendJop;
router.delete(
  "/deleteApplicationForFriendJop/:applicationId",
  auth,
  deleteApplicationForFriendJop
);
// get all MyAppliedJobs
router.get("/myAppliedJobs", auth, getMyAppliedJobs);
async function exportApplicationsToCSV(jobId) {
  try {
    // Step 1: Find the job by its ID and populate applications
    const job = await Job.findById(jobId)
      .populate({
        path: 'applications', // Populate applications to get related documents
        select: '	fullName 	phoneNumber	resume	currentJobTitleEn	currentJobTitleAr	specialtyNameAr	qualification	universityName	specialtyExperience	totalExperience	nationality	email	gender	currentlyEmployed	skills' // Only select relevant fields
      });

    if (!job) {
      throw new Error('Job not found');
    }

    // Step 2: Extract application data
    const applicationsData = job.applications.map(app => ({
      fullName: app.fullName,
      phoneNumber: app.phoneNumber,
      resume: `https://backend.ershad-sa.com/userImages/${app.resume}` ,
      currentJobTitleEn: app.currentJobTitleEn,
      currentJobTitleAr: app.currentJobTitleAr,
      specialtyNameAr: app.specialtyNameAr,
      qualification: app.qualification,
      universityName: app.universityName,
      specialtyExperience: app.specialtyExperience,
      totalExperience: app.totalExperience,
      nationality: app.nationality,
      email: app.email,
      gender: app.gender,
      currentlyEmployed: app.currentlyEmployed,
      skills: app.skills,
    }));

    // Step 3: Convert JSON data to CSV format
    const json2csvParser = new Parser({ fields: ["currentJobTitleAr", "specialtyNameAr", "qualification", "universityName", "specialtyExperience", "totalExperience", "fullName", "nationality", "email", "phoneNumber", "gender", "currentlyEmployed", "skills", "dataConsent", "resume", "currentJobTitleAr", "specialtyNameAr", "qualification", "universityName", "specialtyExperience", "totalExperience", "fullName", "nationality", "email", "phoneNumber", "gender", "currentlyEmployed", "skills", "resume"
] });
    const csvData = json2csvParser.parse(applicationsData);

    // Step 4: Write CSV data to a file in a temporary directory
    const filePath = path.join(__dirname, `job_${ jobId }_applications.csv`);
    // fs.writeFileSync(filePath, csvData);
    fs.writeFileSync(filePath, "\uFEFF" + csvData, { encoding: 'utf8' }); // Add BOM and set encoding to UTF-8


    return filePath; // Return the file path for download
  } catch (error) {
    throw new Error('Error exporting applications to CSV: ' + error.message);
  }
}
router.get('/export-applications/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    // Generate the CSV file
    const filePath = await exportApplicationsToCSV(jobId);

    // Send the CSV file as a downloadable response
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error occurred while sending file');
      } else {
        // Clean up: remove the file after sending it
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/sendjobform", upload.single("resume"), emailJobForm);
{

}
module.exports = router;
