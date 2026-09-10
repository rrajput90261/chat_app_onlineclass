const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

// 1. Send Message
const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required"
            });
        }

        // Must have either text content or an attachment
        if (!content && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty (provide text or attachment)"
            });
        }

        let fileUrl = "";
        let fileName = "";
        let fileType = "";

        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
            fileName = req.file.originalname;
            fileType = req.file.mimetype.startsWith("image/") ? "image" : "document";
        }

        const newMessageData = {
            sender: req.user.userId,
            content: content || "",
            chat: chatId,
            fileUrl,
            fileName,
            fileType,
            readBy: [req.user.userId]
        };

        let message = await Message.create(newMessageData);

        message = await message.populate("sender", "username profileImage email");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "username profileImage email isOnline lastSeen"
        });

        // Update latestMessage in Chat
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id
        });

        return res.status(201).json({
            success: true,
            message
        });

    } catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send message"
        });
    }
};

// 2. Get all messages for a specific chat
const allMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId parameter is required"
            });
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username profileImage email isOnline lastSeen")
            .populate("chat")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("All Messages Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch messages"
        });
    }
};

// 3. Mark all messages in a chat as read
const markAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;

        await Message.updateMany(
            {
                chat: chatId,
                readBy: { $ne: req.user.userId }
            },
            {
                $addToSet: { readBy: req.user.userId }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });

    } catch (error) {
        console.error("Mark As Read Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to mark messages as read"
        });
    }
};

module.exports = {
    sendMessage,
    allMessages,
    markAsRead
};
