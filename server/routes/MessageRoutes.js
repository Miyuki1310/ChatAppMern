const router = require("express").Router();
const multer = require("multer");
const {
  getMessages,
  uploadFiles,
} = require("../controllers/MessageController");
const verifyToken = require("../middlewares/AuthMiddleware");

const upload = multer({ dest: "uploads/files" });

router.post("/get_messages", verifyToken, getMessages);
router.post("/upload_files", verifyToken, upload.single("file"), uploadFiles);
module.exports = router;
