const mongoose = require("mongoose");

const joinFreelancerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    idNumber: { type: String, required: true },
    city: { type: String, required: true },
    englishLevel: {
      type: String,
      //   enum: ["ضعيف", "متوسط", "ممتاز","جيد","جيد جدا","متوسطة","ضعيفة"],
      required: true,
    },
    title: { type: String, enum: ["سيد", "سيدة"], required: true }, // اللقب
    jobTitle: { type: String, required: true },
    degree: { type: String, required: true },
    graduationYear: { type: String },
    bio: { type: String },
    willingToRelocate: { type: String },
    canWorkRemotely: { type: String },
    maritalStatus: {
      type: String,
      enum: ["اعزب", "متزوج", "مطلق", "ارمله"],
    },
    cv: { type: String, required: true },
    status: {
      type: String,
      enum: ["تحت المراجعة", "تم الموافقة", "تم رفضه"],
      default: "تحت المراجعة",
    },
    profilePicture: { type: String }, 
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const JoinFreelaner = mongoose.model("JoinFreelancer", joinFreelancerSchema);
module.exports = JoinFreelaner;
