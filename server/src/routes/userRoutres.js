const express = require("express");

const auth = require("../middleware/auth");

const {
    getProfile,
    getUsers
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", auth, getProfile);

router.get("/", auth, getUsers);

module.exports = router;