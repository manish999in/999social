import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", verifyToken, getNotifications);

// Mark a single notification as read
router.put("/:id/read", verifyToken, markAsRead);

export default router;
