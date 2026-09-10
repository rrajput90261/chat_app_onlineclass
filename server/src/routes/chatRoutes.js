const express = require("express");
const auth = require("../middleware/auth");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
} = require("../controllers/chatController");

const router = express.Router();

router.route("/")
    .post(auth, accessChat)
    .get(auth, fetchChats);

router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/groupadd", auth, addToGroup);
router.put("/groupremove", auth, removeFromGroup);

module.exports = router;
