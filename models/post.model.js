import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },{ timestamps: true });

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    location: { type: String, default: "" },
    visibility: { type: String, enum: ["public", "private", "friends"], default: "public" },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    mediaType: { type: String, enum: ["text", "image", "video"], default: "text" },
    imageUrl: { type: String, default: "" },
    publicId: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },{ timestamps: true });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;



