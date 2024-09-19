const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const {
  createJob,
  getJobs,
    getJobsForClientDash,
  getJobsForClientPublic,
  saveJob,
  unsaveJob,
  deleteJob,
  getSingleJob,
  updateJobStatus,
  getActivatedJobs,
  getSavedJobsForUser,
  getJobsByClient,
} = require("../controllers/jobController");
const { auth, restrictTo } = require("../middlewares/auth");

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

router.post("/create", auth, createJob);
router.get("/", auth, getJobs);
router.get("/activated", getActivatedJobs);
router.get( "/getJobsForClientDash", auth, getJobsForClientDash );
router.get("/getJobsForClientPublic", auth, getJobsForClientPublic);

router.post("/save-job", auth, saveJob);
router.post("/unsave-job", auth, unsaveJob);
router.delete("/delete-job/:jobId", auth, deleteJob);
router.get("/:jobId", auth, restrictTo("Admin"), getSingleJob);
router.get("/savedJop/:userId", auth, getSavedJobsForUser);
router.put("/update-job-status", auth, restrictTo("Admin"), updateJobStatus);
router.get("/jobs/client/:clientId", getJobsByClient);
module.exports = router;
