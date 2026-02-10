import Activity from "../../models/Activity.model.js";

// @desc    Get user activity history
// @route   GET /api/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({ user: userId }).sort({
      createdAt: -1,
    });

    const history = activities.map((activity) => ({
      id: activity._id,
      type: activity.type,
      date: activity.createdAt,
      details: activity.details,
    }));

    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
