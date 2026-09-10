const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const config = require("./src/config/env");
const app = require("./app");
const socketHandler = require("./src/socket/socketHandler");

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Attach socket event handlers
socketHandler(io);

// Store io reference in app for access in controllers if needed
app.set("io", io);

const startServer = async () => {
    try {
        // Connect MongoDB
        await mongoose.connect(config.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        // Start server
        server.listen(config.PORT, () => {
            console.log(`===========================================`);
            console.log(`🚀 Chat App Server running on port ${config.PORT}`);
            console.log(`🌐 Local URL: http://localhost:${config.PORT}`);
            console.log(`===========================================`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();