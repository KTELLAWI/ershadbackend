const mongoose = require("mongoose");

// Custom validator to ensure the fullName has three parts
const isThreePartName = (name) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 3;
};

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: false,
    },
    fullName: {
      type: String,
      required: false,
      // validate: {
      //   validator: isThreePartName,
      //   message:
      //     "Full name must contain at least a first name, middle name, and last name",
      // },
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    resume: {
      type: String,
      required: false,
      default: null,
    },
    currentJobTitleEn: {
      type: String,
      default: "",
    },
    currentJobTitleAr: {
      type: String,
      default: "",
    },
    specialtyNameAr: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    universityName: {
      type: String,
      default: "",
    },
    specialtyExperience: {
      type: Number,
      default: 0,
    },
    totalExperience: {
      type: Number,
      default: 0,
    },
    nationality: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
      type: String,
    },
    currentlyEmployed: {
      type: String,
      // default: "",
    },
    skills: {
      type: String,
      default: "",
    },
    dataConsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



// const applicationSchema = new mongoose.Schema(
//   {
//     freelancer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//       required: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       validate: {
//         validator: isThreePartName,
//         message:
//           "Full name must contain at least a first name, middle name, and last name",
//       },
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     cv: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
