const User = require("../models/User");

// GET CURRENT USER
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get Profile Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.userId }
        })
        .select("-password")
        .sort({ username: 1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get Users Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    getUsers
};