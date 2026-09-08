const http = require("http");
const mongoose = require("mongoose");

const config = require("./src/config/env");
const app = require("./app");

const server = http.createServer(app);

const startServer = async () => {
    try {
        // Connect MongoDB
        await mongoose.connect(config.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        // Start server
        server.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();