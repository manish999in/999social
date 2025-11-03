const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        let folder = "999social"; // main project folder

        // Category based on fieldname
        if (file.fieldname === "profilePic") folder += "/profilePics";
        if (file.fieldname === "coverPic") folder += "/coverPics";
        if (file.fieldname === "postImage") folder += "/posts";

        return {
            folder: folder,
            allowed_formats: ["jpg", "png", "jpeg"],
        };
    },
});

const parser = multer({ storage });

module.exports = parser;
