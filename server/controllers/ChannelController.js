const Channel = require("../models/ChannelModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");
const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);
    console.log(req.body);
    if (!admin) {
      return res.status(400).json({ message: "User not found" });
    }
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid members" });
    }
    const newChannel = new Channel({ name, members, admin: userId });
    await newChannel.save();
    return res.status(200).json({ channel: newChannel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ channels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {}
};

module.exports = { createChannel, getUserChannels, getChannelMessages };
