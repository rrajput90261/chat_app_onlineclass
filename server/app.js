const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const apiRoutes = require("./src/routes/index");
const { notFound, errorHandler } = require("./src/middleware/error");

const app = express();

// Middlewares
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Static folder for frontend client (prefers built dist for React)
const fs = require("fs");
const clientDistPath = path.join(__dirname, "../client/dist");
const clientPath = fs.existsSync(clientDistPath) ? clientDistPath : path.join(__dirname, "../client");
app.use(express.static(clientPath));

// API health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Chat App API is running smoothly 🚀",
        timestamp: new Date().toISOString()
    });
});

// Main API Routes
app.use("/api", apiRoutes);

// Fallback to client index.html for SPA frontend routing (Express 5 compatible)
app.use((req, res, next) => {
    if (req.method === "GET" && !req.url.startsWith("/api") && !req.url.startsWith("/uploads")) {
        return res.sendFile(path.join(clientPath, "index.html"));
    }
    next();
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;