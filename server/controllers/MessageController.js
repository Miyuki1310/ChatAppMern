const Message = require("../models/MessageModels");
const { mkdirSync, renameSync } = require("fs");
const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both users are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timeStamps: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    console.log(req.file);
    const date = Date.now();
    let fileDir = "uploads/files";
    let fileName = `${fileDir}/${req.file.originalname}`;

    // const fileName = "uploads/files/" + req.file.filename;
    mkdirSync("uploads/files", { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getMessages, uploadFiles };
