const Chat = require("../models/Chat");
const User = require("../models/User");

// Find or create a 1-on-1 direct conversation between two users
const findOrCreateDirectChat = async (currentUserId, targetUserId) => {
    // Check if chat already exists
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: currentUserId } } },
            { users: { $elemMatch: { $eq: targetUserId } } }
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username profileImage email isOnline lastSeen"
    });

    if (isChat.length > 0) {
        return isChat[0];
    }

    // Create new direct chat
    const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, targetUserId]
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");
    return fullChat;
};

// Populate chat object with users, latestMessage and groupAdmin
const populateChat = async (chatQuery) => {
    return chatQuery
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .then(async (results) => {
            return await User.populate(results, {
                path: "latestMessage.sender",
                select: "username profileImage email isOnline lastSeen"
            });
        });
};

module.exports = {
    findOrCreateDirectChat,
    populateChat
};
