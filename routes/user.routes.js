import express from "express";
import { getAllUsers,  followUser, getFollowers, getFollowing } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Get all users
router.get("/", verifyToken, getAllUsers);


// ✅ Follow a user
router.post("/:id/follow", verifyToken, followUser);

// ✅ Get followers of a user
router.get("/:id/followers", verifyToken, getFollowers);

// ✅ Get following of a user
router.get("/:id/following", verifyToken, getFollowing);

export default router;
