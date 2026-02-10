import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "account_created",
        "project_created",
        "scan_completed",
        "project_deleted",
      ],
    },
    details: {
      type: Object, // Flexible field to store related data (e.g., project name, score, IDs)
    },
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
