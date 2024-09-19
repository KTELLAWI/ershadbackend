const {
  login,
  logout,
  register,
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
} = require("../controllers/userController.js");

const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { auth, restrictTo } = require("../middlewares/auth.js");

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

//register
router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  register
);
//login
router.post("/login", login);
//logout
router.post("/logout", logout);
//forget password
router.post("/forgot-password", forgotPassword);
//reset password
router.post("/reset-password/:token", resetPassword);
//get All Users (clients or freelancers)
router.get("/", auth, getAllUsers);
//get All clients
router.get("/clients", auth, getAllClients);
//get All freelancers
router.get("/freelancers", auth, getAllFreelancers);
//profile
router.get("/profile/:userId", profile);
//change password
router.put("/changepassword", auth, changePassword);
//delete user
router.delete("/delete/:id", auth, deleteUser);
// update client
router.put(
  "/update-client",
  auth,
  restrictTo("Client"),
  upload.single("companyLogo"),
  updateClient
);
// update freelancer
router.put(
  "/update-freelancer",
  auth,
  restrictTo("Freelancer"),
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  updateFreelancer
);
//get single user
router.get( "/:userId", auth, restrictTo( "Admin" ), getSingleUser );
// number of clients and freelancers and jobs
router.get("/stats/counts", auth, restrictTo("Admin"), getCounts);
router.get("/stats/ratio", auth, restrictTo("Admin"), getUserRatios);
router.put(
  "/update-account-status",
  auth,
  restrictTo("Admin"),
  toggleAccountStatus
);
router.get(
  "/loginStats/byMonth",
  auth,
  restrictTo("Admin"),
  getLoginStatsByMonth
);
module.exports = router;
