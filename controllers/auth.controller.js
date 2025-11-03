import bcrypt from "bcrypt";
import User from "../models/user.model.js"; // <-- small letters + .js extension

import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      age,
      gender,
      bio,
      location,
    } = req.body;

    const profilePic = req.files?.profilePic?.[0];
    const coverPic = req.files?.coverPic?.[0];

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or Username already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Upload images to Cloudinary (optional)
    let profilePicUrl = "";
    let coverPicUrl = "";

    if (profilePic) {
      const uploadRes = await cloudinary.uploader.upload(profilePic.path, {
        folder: "social-media/profilePics",
      });
      profilePicUrl = uploadRes.secure_url;
    }

    if (coverPic) {
      const uploadRes = await cloudinary.uploader.upload(coverPic.path, {
        folder: "social-media/coverPics",
      });
      coverPicUrl = uploadRes.secure_url;
    }

    const newUser = new User({
      name,
      username,
      email,
      passwordHash,
      age,
      gender,
      bio,
      location,
      profilePic: profilePicUrl,
      coverPic: coverPicUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};
