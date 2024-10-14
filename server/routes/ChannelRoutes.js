const router = require("express").Router();

const {
  createChannel,
  getUserChannels,
  getChannelMessages,
} = require("../controllers/ChannelController");
const verifyToken = require("../middlewares/AuthMiddleware");

router.post("/create_channel", verifyToken, createChannel);
router.get("/get_user_channels", verifyToken, getUserChannels);
router.get("/get_channel_messages/:channelId", verifyToken, getChannelMessages);

module.exports = router;
