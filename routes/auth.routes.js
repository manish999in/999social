import express from "express";
import multer from "multer";
import { signup, loginUser } from "../controllers/auth.controller.js"; // ✅ FIXED

const router = express.Router();

// multer setup (for local temp storage before Cloudinary)
const upload = multer({ dest: "uploads/" });
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getCurrentUser, updateProfile } from "../controllers/auth.controller.js";


// ✅ Signup route
router.post(
  "/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  signup
);

// ✅ Login route
router.post("/login", loginUser);


// Get current logged-in user
router.get("/me", verifyToken, getCurrentUser);

// Update current user profile
router.put("/me", verifyToken, updateProfile);


// Logout route
router.post("/logout", verifyToken, async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});


export default router;
