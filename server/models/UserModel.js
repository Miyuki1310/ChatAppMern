const mongoose = require("mongoose");
const { genSalt, hash } = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  image: {
    type: String,
  },

  color: {
    type: Number,
  },

  profileSetup: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
