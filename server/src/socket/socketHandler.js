const User = require("../models/User");

// In-memory tracking of active online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        let currentUserId = null;

        // 1. User setup & connection
        socket.on("setup", async (userData) => {
            if (!userData || (!userData.id && !userData._id)) return;
            const userId = String(userData.id || userData._id);
            currentUserId = userId;

            socket.join(userId);
            socket.emit("connected", { socketId: socket.id });

            // Register in onlinetracking
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);

            // Mark user online in DB
            try {
                await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    lastSeen: new Date()
                });
            } catch (err) {
                console.error("Error updating online status:", err.message);
            }

            // Broadcast to all clients that this user is online
            io.emit("user_status", {
                userId,
                isOnline: true
            });

            // Send list of all currently online user IDs to the connected client
            socket.emit("all_online_users", Array.from(onlineUsers.keys()));
            console.log(`[Socket] User setup: ${userId} (${socket.id})`);
        });

        // 2. Join a chat room
        socket.on("join_chat", (room) => {
            if (!room) return;
            socket.join(room);
            console.log(`[Socket] User ${socket.id} joined room: ${room}`);
        });

        // 3. Leave a chat room
        socket.on("leave_chat", (room) => {
            if (!room) return;
            socket.leave(room);
            console.log(`[Socket] User ${socket.id} left room: ${room}`);
        });

        // 4. Typing indicators
        socket.on("typing", (data) => {
            if (!data || !data.room) return;
            socket.in(data.room).emit("typing", data);
        });

        socket.on("stop_typing", (data) => {
            if (!data || !data.room) return;
            socket.in(data.room).emit("stop_typing", data);
        });

        // 5. Real-time new message dispatch
        socket.on("new_message", (newMessageReceived) => {
            const chat = newMessageReceived.chat;
            if (!chat || !chat.users) return;

            chat.users.forEach((user) => {
                const targetUserId = String(user._id || user.id || user);
                const senderId = String(
                    newMessageReceived.sender._id ||
                    newMessageReceived.sender.id ||
                    newMessageReceived.sender
                );

                // Do not send duplicate back to sender
                if (targetUserId === senderId) return;

                // Deliver directly to the user's personal room
                socket.in(targetUserId).emit("message_received", newMessageReceived);
            });
        });

        // 6. Message read receipts
        socket.on("mark_read", (data) => {
            if (!data || !data.chatId) return;
            socket.in(data.chatId).emit("messages_read", data);
        });

        // 7. Disconnection
        socket.on("disconnect", async () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);

            if (currentUserId && onlineUsers.has(currentUserId)) {
                const userSockets = onlineUsers.get(currentUserId);
                userSockets.delete(socket.id);

                // If user has no other active socket connections
                if (userSockets.size === 0) {
                    onlineUsers.delete(currentUserId);

                    const lastSeen = new Date();
                    try {
                        await User.findByIdAndUpdate(currentUserId, {
                            isOnline: false,
                            lastSeen
                        });
                    } catch (err) {
                        console.error("Error setting offline:", err.message);
                    }

                    // Broadcast offline status
                    io.emit("user_status", {
                        userId: currentUserId,
                        isOnline: false,
                        lastSeen
                    });
                }
            }
        });
    });
};

module.exports = socketHandler;
