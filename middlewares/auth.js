const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtErshad;

    if (!token)
      return res.status(401).json({ message: "من فضلك قم بتسجيل الدخول" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded._id);
    if (!user.accountStatus) {
      res.clearCookie("jwtErshad");
      return res.status(403).json({ message: "تم تعطيل هذا الحساب" });
    }
    req.user = { ...decoded, _id: decoded._id };

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to view this resource" });
    }
    next();
  };
