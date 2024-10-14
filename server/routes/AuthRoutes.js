const express = require("express");
const multer = require("multer");

const {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} = require("../controllers/AuthController");
const verifyToken = require("../middlewares/AuthMiddleware");

const authRoute = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/user_info", verifyToken, getUserInfo);
authRoute.post("/update_profile", verifyToken, updateProfile);
authRoute.post(
  "/add_profile_image",
  verifyToken,
  upload.single("profile_image"),
  addProfileImage
);
authRoute.post("/logout", logout);

authRoute.delete("/remove_profile_image", verifyToken, removeProfileImage);

module.exports = authRoute;
