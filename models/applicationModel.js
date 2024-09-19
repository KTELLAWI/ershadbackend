const mongoose = require("mongoose");

// Custom validator to ensure the fullName has three parts
const isThreePartName = (name) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 3;
};

const applicationSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      validate: {
        validator: isThreePartName,
        message:
          "Full name must contain at least a first name, middle name, and last name",
      },
    },
    phone: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
