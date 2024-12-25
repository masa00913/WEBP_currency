// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/profile (要:認証)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
