import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    improvements: [
      {
        type: String,
      },
    ],
    technicalDetails: {
      type: Object, // Stores JSON data from scraper
    },
    scannedUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
