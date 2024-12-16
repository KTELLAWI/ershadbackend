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
// const joinFreelancerSchema = new mongoose.Schema(
//   {
//     title: { type: String, enum: ["سيد", "سيدة"] },
//     fullName: { type: String },
//     // phoneNumber: { type: String },
//     // email: { type: String },
//     phoneNumber: { type: String, unique: true, sparse: true },  // Unique index
//     email: { type: String, unique: true, sparse: true },        // Unique index
//     city: { type: String },
//     jobTitle: { type: String },
//     degree: { type: String },
//     graduationYear: { type: String },
//     willingToRelocate: { type: String },
//     cv: { type: String },
//     idNumber: { type: String },
//     englishLevel: { type: String },
//     country: { type: String },
//     canWorkRemotely: { type: String },
//     maritalStatus: { type: String, enum: ["اعزب", "متزوج", "مطلق", "ارمله"] },
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
    currentJobTitleEn: { type: String, required: false },
    currentJobTitleAr: { type: String, required: false },
    specialtyNameAr: { type: String, required: false },
    qualification: { type: String, required: false },
    universityName: { type: String, required: false },
    specialtyExperience: { type: String, required: false },
    totalExperience: { type: String, required: false },
    fullName: { type: String, required: false },
    nationality: { type: String, required: false },
    email: { type: String, unique: true, sparse: true, required: false }, // Unique index
    phoneNumber: { type: String, unique: true, sparse: true, required: false }, // Unique index
    gender: { type: String, required: false },
    currentlyEmployed: { type: String, required: false },
    skills: { type: String, required: false },
    resume: { type: String, required: false },
    // Uncomment and modify if needed for future updates
    // dataConsent: { type: Boolean, default: false, required: false },
    // job: { type: String, required: false },
},
{
    timestamps: true,
}


);



const JoinFreelaner = mongoose.model("JoinFreelancer", joinFreelancerSchema);
module.exports = JoinFreelaner;