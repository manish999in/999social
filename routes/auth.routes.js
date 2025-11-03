import express from "express";
import multer from "multer";
import { signup, loginUser } from "../controllers/auth.controller.js"; // ✅ FIXED

const router = express.Router();

// multer setup (for local temp storage before Cloudinary)
const upload = multer({ dest: "uploads/" });
import { verifyToken } from "../middlewares/auth.middleware.js";


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


router.get("/profile", verifyToken, async (req, res) => {
  res.json({ message: "Access granted ✅", user: req.user });
});


export default router;
