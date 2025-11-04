import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

// Get notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePic")
      .populate("post", "content imageUrl");

    res.status(200).json({
      message: "Notifications fetched successfully",
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};
