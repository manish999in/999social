import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    profilePic: { type: String, default: "" }, // Cloudinary URL placeholder
    coverPic: { type: String, default: "" },   // optional cover photo
  },
  { timestamps: true }
);

// Nodemon reload safe
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
