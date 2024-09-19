const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { auth } = require("../middlewares/auth.js");
const {
  applyForJob,
  deleteApplicationForFriendApplication,
  deleteApplicationForFriendJop,
  getMyAppliedJobs,
} = require("../controllers/applicationController.js");

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
module.exports = router;
