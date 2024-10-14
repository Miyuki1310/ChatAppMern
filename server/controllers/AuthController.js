const { compare } = require("bcrypt");
const User = require("../models/UserModel");
const { sign } = require("jsonwebtoken");
const { renameSync, unlinkSync } = require("fs");
const maxAge = 3 * 24 * 60 * 60;
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Please provide an email and password" });
      return;
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).send("Email is already taken");
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(user.email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        email: user.email,
        userId: user._id,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const auth = await compare(password, user.password);
  if (!auth) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  res.cookie("jwt", createToken(user.email, user._id), {
    maxAge,
    secure: true,
    sameSite: "None",
  });
  return res.status(201).json({
    user: {
      email: user.email,
      userId: user._id,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    },
  });
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        email: user.email,
        userId: user._id,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;
    console.log(req.body);
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "First name, Last name, color is required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(user);

    return res.status(200).json({
      user: {
        email: user.email,
        userId: user._id,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileName = `uploads/profiles/${req.file.filename}`;
    renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const removeProfileImage = async (req, res, next) => {
  try {
    const user = User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.image) {
      unlinkSync(user.image);
      user.image = null;
      await user.save();
    }
    return res.status(200).json({ message: "Image removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
};
