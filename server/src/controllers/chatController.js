const Chat = require("../models/Chat");
const User = require("../models/User");
const { findOrCreateDirectChat, populateChat } = require("../services/chatService");

// 1. Access or create 1-on-1 chat
const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId parameter is required"
        });
    }

    if (userId === req.user.userId) {
        return res.status(400).json({
            success: false,
            message: "Cannot create a chat with yourself"
        });
    }

    try {
        const chat = await findOrCreateDirectChat(req.user.userId, userId);
        return res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        console.error("Access Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to access chat"
        });
    }
};

// 2. Fetch all chats for logged-in user
const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user.userId } }
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

        const populatedChats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "username profileImage email isOnline lastSeen"
        });

        return res.status(200).json({
            success: true,
            count: populatedChats.length,
            chats: populatedChats
        });
    } catch (error) {
        console.error("Fetch Chats Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch chats"
        });
    }
};

// 3. Create Group Chat
const createGroupChat = async (req, res) => {
    try {
        let { name, users } = req.body;

        if (!name || !users) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields (name and users)"
            });
        }

        if (typeof users === "string") {
            users = JSON.parse(users);
        }

        if (users.length < 2) {
            return res.status(400).json({
                success: false,
                message: "At least 2 users are required to form a group chat"
            });
        }

        // Add current user to group
        users.push(req.user.userId);

        const groupChat = await Chat.create({
            chatName: name.trim(),
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.userId
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return res.status(201).json({
            success: true,
            chat: fullGroupChat
        });
    } catch (error) {
        console.error("Create Group Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create group"
        });
    }
};

// 4. Rename Group
const renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body;

        if (!chatId || !chatName) {
            return res.status(400).json({
                success: false,
                message: "chatId and chatName are required"
            });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName: chatName.trim() },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            chat: updatedChat
        });
    } catch (error) {
        console.error("Rename Group Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to rename group"
        });
    }
};

// 5. Add user to group
const addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "chatId and userId are required"
            });
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!added) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            chat: added
        });
    } catch (error) {
        console.error("Add To Group Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add member"
        });
    }
};

// 6. Remove user from group
const removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "chatId and userId are required"
            });
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            chat: removed
        });
    } catch (error) {
        console.error("Remove From Group Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to remove member"
        });
    }
};

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
};
