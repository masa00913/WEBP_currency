// routes/walletRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { getWalletBalance } = require("../controllers/walletController");

// GET /api/wallets/balance (要:認証)
router.get("/balance", authMiddleware, getWalletBalance);

module.exports = router;
