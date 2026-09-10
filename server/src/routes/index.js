const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutres = require("./userRoutres");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutres);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
