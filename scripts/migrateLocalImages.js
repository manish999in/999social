import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import path from "path";
import fs from "fs";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const migrateImages = async () => {
  const users = await User.find({ profilePic: /uploads\\/ }); // find users with local path

  for (const user of users) {
    try {
      const localPath = path.resolve(`./${user.profilePic}`);
      if (fs.existsSync(localPath)) {
        const upload = await cloudinary.uploader.upload(localPath, {
          folder: "999social/profilePics",
        });
        user.profilePic = upload.secure_url;
        await user.save();
        console.log(`✅ Migrated: ${user.username}`);
      }
    } catch (err) {
      console.error(`❌ Failed for ${user.username}:`, err.message);
    }
  }

  console.log("✅ Migration complete");
  process.exit();
};

migrateImages();
