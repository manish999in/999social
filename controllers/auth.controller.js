import bcrypt from "bcrypt";
import User from "../models/user.model.js"; // <-- small letters + .js extension
import jwt from "jsonwebtoken";  // ✅ ADD THIS LINE

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

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // valid for 7 days
    );

    res.status(200).json({
  message: "Login successful",
  token, // JWT token
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    age: user.age,
    gender: user.gender,
    bio: user.bio,
    location: user.location,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  },
});

  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};