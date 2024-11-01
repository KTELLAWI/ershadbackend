const express = require("express");
const path = require("path");
const multer = require("multer");
const { Parser } = require('json2csv');

const fs = require("fs");
const { auth } = require("../middlewares/auth.js");
const {
  applyForJob,
  deleteApplicationForFriendApplication,
  deleteApplicationForFriendJop,
  getMyAppliedJobs,
} = require("../controllers/applicationController.js");
const Job = require("../models/jobModel");
const mongoose = require("mongoose");
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
router.post("/apply", auth, upload.single("cv"), applyForJob);
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
        select: 'cv fullName phone' // Only select relevant fields
      });

    if (!job) {
      throw new Error('Job not found');
    }

    // Step 2: Extract application data
    const applicationsData = job.applications.map(app => ({
      cv: app.cv,
      fullName: app.fullName,
      phone: app.phone
    }));

    // Step 3: Convert JSON data to CSV format
    const json2csvParser = new Parser({ fields: ['fullName', 'phone', 'cv'] });
    const csvData = json2csvParser.parse(applicationsData);

    // Step 4: Write CSV data to a file in a temporary directory
    const filePath = path.join(__dirname, `job_${jobId}_applications.csv`);
    fs.writeFileSync(filePath, csvData);

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
module.exports = router;
