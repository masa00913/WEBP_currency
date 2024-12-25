// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { sendCurrency, getMyTransactions } = require("../controllers/transactionController");

// POST /api/transactions/send (要:認証)
router.post("/send", authMiddleware, sendCurrency);

// GET /api/transactions (要:認証)
// 自分に関連する取引一覧を取得
router.get("/", authMiddleware, getMyTransactions);

module.exports = router;
