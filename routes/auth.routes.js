import express from "express";
import multer from "multer";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

// multer setup (for local temp storage before Cloudinary)
const upload = multer({ dest: "uploads/" });

router.post(
  "/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  signup
);

export default router;
