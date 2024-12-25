// controllers/walletController.js
const walletModel = require("../models/walletModel");

module.exports = {
  getWalletBalance,
};

// ログインユーザのウォレット残高を取得
async function getWalletBalance(req, res) {
  try {
    const userId = req.user?.userId; // authMiddleware でセットされる
    if (!userId) {
      return res.status(401).json({ error: "認証情報がありません" });
    }

    // ウォレット取得
    const wallet = await walletModel.getWalletByUserId(userId);
    if (!wallet) {
      return res.status(404).json({ error: "ウォレットが存在しません" });
    }

    return res.json({
      walletId: wallet.id,
      balance: wallet.balance,
      updated_at: wallet.updated_at,
    });
  } catch (error) {
    console.error("getWalletBalanceエラー:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}
