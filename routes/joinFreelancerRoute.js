const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { auth, restrictTo,activated } = require("../middlewares/auth.js");
const {
  applyToWork,
  deleteJoinFreelancerRequest,
  getSingleJoinRequest,
  updateWorkStatus,
  updateJoinRequest,
  exportTableToCsv,
  insertSheet,
  getApprovedFreelancers,
  getPendingFreelancers,
} = require("../controllers/joinFreelancerController.js");



// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../userImages");

    // Check if the upload directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Set upload destination
  },
  filename: (req, file, cb) => {
    // Create a unique filename with a timestamp
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  '/applyToWork',
  auth, // Authentication middleware
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ]), 
  // (req, res) => {
  //   // Debug logs to ensure files and body data are being received
  //   console.log('Files:', req.files); // Logs uploaded files
  //   console.log('Body:', req.body);   // Logs the rest of the form fields

  //   // Check if files exist
  //   if (req.files && req.files.cv && req.files.profilePicture) {
  //     console.log('CV and profile picture uploaded successfully');
  //   } else {
  //     console.log('Files are missing in the request');
  //   }


  //   // Perform your logic to save the data (e.g., to the database)

  //   res.status(201).json({
  //     message: "Application submitted successfully",
  //     files: req.files,
  //     body: req.body
  //   });
  // },
  applyToWork

);



//upload image
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, "../userImages");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

router.get("/export-csv", auth, restrictTo("Admin"), exportTableToCsv);
// router.post(
//   "/applyToWork",
//  auth,
//  upload.fields([
//    { name: "cv", maxCount: 1 },
//     { name: "profilePicture", maxCount: 1 },
//   ]),
// applyToWork
// );
router.get("/approved-freelancers",activated, getApprovedFreelancers);
router.get("/pending-freelancers", auth, getPendingFreelancers);
router.delete("/delete-join/:id", auth, deleteJoinFreelancerRequest);
router.post("/add/csv", auth, upload.single("file"), insertSheet);
router.get(
  "/singleJoinRequest/:id",
  auth,
  restrictTo("Admin"),
  getSingleJoinRequest
);
router.put("/update-work-status", auth, restrictTo("Admin"), updateWorkStatus);
router.put(
  "/updateJoinRequest/:id",
  auth,
  restrictTo("Admin"),
  upload.none(),
  updateJoinRequest
);

router.get("/download/freelancers.csv", (req, res) => {
  const filePath = path.join(__dirname, "../exports", "freelancers.csv");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "freelancers.csv", (err) => {
      if (err) {
        console.error("Error downloading file:", err.message);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});
module.exports = router;
