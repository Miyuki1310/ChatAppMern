const User = require("../models/UserModel");
const Message = require("../models/MessageModels");
const mongoose = require("mongoose");

const searchContact = async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(sanitizedSearchTerm, "i");
  const contacts = await User.find({
    $and: [
      { _id: { $ne: req.userId } },
      { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
    ],
  });
  return res.status(200).json({ contacts });
};

const getContractsForDMList = async (req, res) => {
  try {
    const { userId } = req;
    const id = new mongoose.Types.ObjectId(userId);
    const contracts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: id }, { recipient: id }],
        },
      },
      {
        $sort: { timeStamps: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", id] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timeStamps" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contractInfo",
        },
      },
      {
        $unwind: "$contractInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contractInfo.email",
          firstName: "$contractInfo.firstName",
          lastName: "$contractInfo.lastName",
          image: "$contractInfo.image",
          color: "$contractInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    console.log(contracts);

    return res.status(200).json({ contracts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => {
      return {
        label: user.firstName
          ? `${user.firstName} ${user.lastName}`
          : user.email,
        value: user._id,
      };
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchContact, getContractsForDMList, getAllContacts };
