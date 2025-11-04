import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    bio: { type: String, default: "" },
    age: { type: Number },
    gender: { type: String },
    location: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // added
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // added
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);