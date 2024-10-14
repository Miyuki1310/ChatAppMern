const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./db/connectDB");
const authRoute = require("./routes/AuthRoutes");
const contacts = require("./routes/ContactRoute");
const messageRoute = require("./routes/MessageRoutes");
const channelRoute = require("./routes/ChannelRoutes");
const setupSocket = require("./socket");

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads/profiles", express.static("./uploads/profiles"));
app.use("/uploads/files", express.static("./uploads/files"));

app.use("/api/auth", authRoute);
app.use("/api/contact", contacts);
app.use("/api/message", messageRoute);
app.use("/api/channel", channelRoute);
const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
    setupSocket(server);
  } catch (error) {
    console.log(error);
  }
};

start();
