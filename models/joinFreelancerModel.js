const mongoose = require("mongoose");

// const joinFreelancerSchema = new mongoose.Schema(
//   {
//     title: { type: String, enum: ["سيد", "سيدة"], required: true }, 
//     fullName: { type: String, required: true },
//     phoneNumber: { type: String, required: true },
//     email: { type: String, required: true },
//     city: { type: String, required: true },
//     jobTitle: { type: String, required: true },
//     degree: { type: String, required: true },
//     graduationYear: { type: String },
//     willingToRelocate: { type: String },
//     cv: { type: String, required: true },
//     idNumber: { type: String}, //hint
//     englishLevel: {
//       type: String,
//      //hint
//     },
//     country: { type: String },  //hint
//     canWorkRemotely: { type: String },
//     maritalStatus: {
//       type: String,
//       enum: ["اعزب", "متزوج", "مطلق", "ارمله"],
//     },
//     status: {
//       type: String,
//       enum: ["تحت المراجعة", "تم الموافقة", "تم رفضه"],
//       default: "تحت المراجعة",
//     },
//     bio: { type: String },
//     profilePicture: { type: String }, 
//   },
//   {
//     timestamps: true,
//   }
// );
const joinFreelancerSchema = new mongoose.Schema(
  {
    title: { type: String, enum: ["سيد", "سيدة"] },
    fullName: { type: String },
    // phoneNumber: { type: String },
    // email: { type: String },
    phoneNumber: { type: String, unique: true, sparse: true },  // Unique index
    email: { type: String, unique: true, sparse: true },        // Unique index
    city: { type: String },
    jobTitle: { type: String },
    degree: { type: String },
    graduationYear: { type: String },
    willingToRelocate: { type: String },
    cv: { type: String },
    idNumber: { type: String },
    englishLevel: { type: String },
    country: { type: String },
    canWorkRemotely: { type: String },
    maritalStatus: { type: String, enum: ["اعزب", "متزوج", "مطلق", "ارمله"] },
    status: {
      type: String,
      enum: ["تحت المراجعة", "تم الموافقة", "تم رفضه"],
      default: "تحت المراجعة",
    },
    bio: { type: String },
    profilePicture: { type: String },
  },
  {
    timestamps: true,
  }
);

const JoinFreelaner = mongoose.model("JoinFreelancer", joinFreelancerSchema);
module.exports = JoinFreelaner;