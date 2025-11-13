import express from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
  likePostWithNotification,
  addComment,
  deleteComment,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Multer setup
const upload = multer({ dest: "uploads/" });

// Create post
router.post("/", verifyToken, upload.single("image"), createPost);

// Get feed
router.get("/", getAllPosts); 

// Get posts by user (must come before :id route)
router.get("/user/:id", getPostsByUser);

// Get single post
router.get("/:id", getPostById);

// Update post
router.put("/:id", verifyToken, upload.single("image"), updatePost);

// Delete post
router.delete("/:id", verifyToken, deletePost);

// Like / unlike
router.post("/:id/like", verifyToken, likePostWithNotification);

// Comments
router.post("/:id/comment", verifyToken, addComment);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

export default router;
