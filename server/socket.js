const { Server } = require("socket.io");
const Message = require("./models/MessageModels");
const Channel = require("./models/ChannelModel");
require("dotenv").config();
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log("User disconnected", socket.id);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    console.log(message);
    const { channelId, content, sender, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      content,
      sender,
      messageType,
      fileUrl,
      recipient: null,
      timeStamps: new Date(),
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: messageData._id },
    });

    const channel = await Channel.findById(channelId)
      .populate("members")
      .exec();

    const finalData = { ...messageData._doc, channel: channel }; //giải thích: messageData._doc là dữ liệu của messageData, channel: channel là dữ liệu của channel

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      });
    }
    const adminSocketId = userSocketMap.get(channel.admin.toString());
    if (adminSocketId) {
      io.to(adminSocketId).emit("receiveChannelMessage", finalData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      // console.log("User connected", userId);
      // console.log(userSocketMap);
    } else {
      console.log("UserId is not provided");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);

    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};

module.exports = setupSocket;
