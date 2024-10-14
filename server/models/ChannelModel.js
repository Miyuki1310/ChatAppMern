const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
