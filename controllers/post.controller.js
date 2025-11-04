import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"; // ✅ Import Notification
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

// Upload helper
const uploadToCloudinary = async (filePath, folder) => {
  if (!filePath) return "";
  const res = await cloudinary.uploader.upload(filePath, { folder });
  try { await fs.unlink(filePath); } catch (err) {}
  return { url: res.secure_url, publicId: res.public_id };
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { content, description, tags, location, visibility, mentions, mediaType } = req.body;
    const file = req.file;
    let imageUrl = "";
    let publicId = "";

    if (file) {
      const uploadRes = await cloudinary.uploader.upload(file.path, { folder: "social-media/posts" });
      imageUrl = uploadRes.secure_url;
      publicId = uploadRes.public_id;
      await fs.unlink(file.path);
    }

    const newPost = new Post({
      user: req.user.id,
      content,
      description: description || "",
      tags: tags ? tags.split(",").map(t => t.trim().toLowerCase()) : [],
      location: location || "",
      visibility: visibility || "public",
      mentions: mentions ? mentions.split(",") : [],
      mediaType: mediaType || (file ? "image" : "text"),
      imageUrl,
      publicId,
    });

    await newPost.save();
    const populated = await Post.findById(newPost._id).populate("user", "username profilePic");
    res.status(201).json({ message: "Post created successfully", post: populated });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const { content, description, tags, location, visibility } = req.body;
    if (content) post.content = content;
    if (description) post.description = description;
    if (location) post.location = location;
    if (visibility) post.visibility = visibility;
    if (tags) post.tags = tags.split(",").map(t => t.trim().toLowerCase());

    if (req.file) {
      if (post.publicId) await cloudinary.uploader.destroy(post.publicId);
      const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "social-media/posts" });
      post.imageUrl = uploadRes.secure_url;
      post.publicId = uploadRes.public_id;
      await fs.unlink(req.file.path);
    }

    await post.save();
    const populated = await Post.findById(post._id).populate("user", "username profilePic");
    res.status(200).json({ message: "Post updated successfully", post: populated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    if (post.publicId) await cloudinary.uploader.destroy(post.publicId);
    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(50, parseInt(req.query.limit || "10"));
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    res.status(200).json({ message: "Posts fetched", page, limit, posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post fetched", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
};

// Get posts by user
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic");
    res.status(200).json({ message: "User posts fetched", posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user posts", error: error.message });
  }
};

// Like / Unlike post with notification
export const likePost = async (req, res) => {
  try {
    console.log("=== Like Post Endpoint Called ===");
    const postId = req.params.id;
    const userId = req.user.id;

    console.log("Post ID:", postId);
    console.log("User ID:", userId);

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post found:", post._id, "Owner:", post.user.toString());

    // Check if user already liked
    const likedIndex = post.likes.findIndex(u => u.toString() === userId);
    console.log("Liked Index:", likedIndex);

    if (likedIndex === -1) {
      // Add like
      post.likes.push(userId);
      console.log("Post liked by user");

      // Create notification only if liker is not the owner
      if (post.user.toString() !== userId) {
        console.log("Creating notification for post owner:", post.user.toString());
        const notif = await Notification.create({
          user: post.user,    // receiver
          sender: userId,     // liker
          post: post._id,
          type: "like",
        });
        console.log("Notification created:", notif._id);
      } else {
        console.log("User liked their own post - no notification created");
      }

      await post.save();
      console.log("Post saved with new like");
      return res.status(200).json({ message: "Post liked", likesCount: post.likes.length });
    }

    // If already liked → remove like
    post.likes.splice(likedIndex, 1);
    await post.save();
    console.log("Like removed, post saved");

    res.status(200).json({ message: "Like removed", likesCount: post.likes.length });
  } catch (error) {
    console.error("Error in likePost:", error.message);
    res.status(500).json({ message: "Failed to like/unlike post", error: error.message });
  }
};
// post.controller.js
export const likePostWithNotification = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;
        const likedIndex = post.likes.findIndex(u => u.toString() === userId);

        if (likedIndex === -1) {
            // Like
            post.likes.push(userId);

            // Create notification
            if (post.user.toString() !== userId) {
                await Notification.create({
                    user: post.user,
                    sender: userId,
                    post: post._id,
                    type: "like",
                });
            }

            await post.save();
            return res.status(200).json({ message: "Post liked", likesCount: post.likes.length });
        }

        // Unlike
        post.likes.splice(likedIndex, 1);
        await post.save();
        res.status(200).json({ message: "Like removed", likesCount: post.likes.length });

    } catch (error) {
        res.status(500).json({ message: "Failed to like/unlike post", error: error.message });
    }
};


export const getNotifications = async (req, res) => {
  try {
    console.log("=== Get Notifications Endpoint Called ===");
    const userId = req.user.id;
    console.log("Fetching notifications for user:", userId);

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePic")
      .populate("post", "content imageUrl");

    console.log("Notifications fetched:", notifications.length);
    notifications.forEach((n, idx) => {
      console.log(`${idx + 1}: Type: ${n.type}, From: ${n.sender.username}, PostID: ${n.post?._id}`);
    });

    res.status(200).json({
      message: "Notifications fetched successfully",
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populated = await Post.findById(post._id).populate("comments.user", "username profilePic");
    res.status(201).json({ message: "Comment added", comments: populated.comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    post.comments.pull(comment);
    await post.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};
