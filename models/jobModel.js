const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
    status: {
      type: String,
      enum: ['تحت المراجعة', 'تم الموافقة', 'تم رفضه'],
      default: 'تحت المراجعة'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
