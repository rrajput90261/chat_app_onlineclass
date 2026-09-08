const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const userRoutres = require("./src/routes/userRoutres");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Chat App Backend is running"
    });
});

// Auth routes
app.use("/api/auth", authRoutes);
// User routes
app.use("/api/users", userRoutres);

module.exports = app;