const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Freelancer", "Admin", "Client"],
      required: true,
    },
    accountStatus: {
      type: Boolean,
      default: true,
    },
    name: { type: String },
    companyName: { type: String },
    companyLogo: { type: String },
    cv: { type: String },
    contact: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 6 },
    jobTitle: { type: String },
    education: [{ type: String }],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    profilePicture: { type: String },
    skills: {
      type: [String],
      default: [],
    },
    confirmPassword: { type: String },
    address: { type: String },
    bio: { type: String, trim: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: [{ type: Date }],
  },
  {
    timestamps: true,
  }
);
// Index for better performance on lastLogin field
userSchema.index({ lastLogin: 1 });
//Export the model
module.exports = mongoose.model("User", userSchema);
