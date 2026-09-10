const dotenv = require("dotenv");
const path = require("path");

// Try loading from server/.env, fallback to root .env
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, "../../../.env") });
dotenv.config(); // fallback to cwd

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chat_app",
    JWT_SECRET: process.env.JWT_SECRET || "chat_app_secret_2026",
};

module.exports = config;