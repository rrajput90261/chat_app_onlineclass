const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
    sendMessage,
    allMessages,
    markAsRead
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", auth, upload.single("file"), sendMessage);
router.get("/:chatId", auth, allMessages);
router.put("/:chatId/read", auth, markAsRead);

module.exports = router;
