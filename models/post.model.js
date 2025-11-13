import mongoose from "mongoose";

/* -------------------- Comment Schema -------------------- */
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* -------------------- Post Schema -------------------- */
const postSchema = new mongoose.Schema(
  {
    // 🧍 User who created the post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✍️ Text content or caption
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // 📝 Optional description or longer text
    description: {
      type: String,
      default: "",
    },

    // 🏷️ Tags / hashtags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // 📍 Location tag
    location: {
      type: String,
      default: "",
    },

    // 👀 Who can see it
    visibility: {
      type: String,
      enum: ["public", "private", "friends"],
      default: "public",
    },

    // 👥 Mentioned users
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🖼️ Media info
    mediaType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "", // for Cloudinary public_id (useful for delete)
    },

    // ❤️ Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments array
    comments: [commentSchema],
  },
  { timestamps: true }
);

/* -------------------- Indexes for Performance -------------------- */
postSchema.index({ user: 1, createdAt: -1 }); // sort by newest posts per user

/* -------------------- Export Model -------------------- */
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
