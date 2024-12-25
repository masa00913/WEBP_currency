// controllers/transactionController.js
const db = require("../config/db"); // SQLiteのトランザクションに使用
const walletModel = require("../models/walletModel");
const transactionModel = require("../models/transactionModel");

module.exports = {
  sendCurrency,
  getMyTransactions,
};

// 通貨を送金する (from → to)
async function sendCurrency(req, res) {
  const fromUserId = req.user?.userId; // 送金元:ログインしているユーザ
  const { toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount) {
    return res.status(400).json({ error: "送金先ユーザIDと金額は必須です" });
  }

  // 数値変換 (小数利用しない想定)
  const amt = parseInt(amount, 10);
  if (amt <= 0) {
    return res.status(400).json({ error: "送金額は正の整数で指定してください" });
  }

  // SQLiteのトランザクションを使用
  db.serialize(async () => {
    db.run("BEGIN TRANSACTION"); // トランザクション開始

    try {
      // 送金元ウォレット
      const fromWallet = await walletModel.getWalletByUserId(fromUserId);
      if (!fromWallet) {
        throw new Error("送金元ウォレットが存在しません");
      }
      if (fromWallet.balance < amt) {
        throw new Error("残高不足です");
      }

      // 送金先ウォレット
      const toWallet = await walletModel.getWalletByUserId(toUserId);
      if (!toWallet) {
        throw new Error("送金先ウォレットが存在しません");
      }

      // 残高を更新 (fromWalletを減算、toWalletを加算)
      const newFromBalance = fromWallet.balance - amt;
      await walletModel.updateWalletBalance(fromWallet.id, newFromBalance);

      const newToBalance = toWallet.balance + amt;
      await walletModel.updateWalletBalance(toWallet.id, newToBalance);

      // トランザクション履歴を作成
      await transactionModel.createTransaction(fromUserId, toUserId, amt, "completed");

      db.run("COMMIT", (err) => {
        if (err) {
          throw err;
        }
        // 成功レスポンス
        res.json({ message: "送金完了", fromUserId, toUserId, amount: amt });
      });
    } catch (error) {
      console.error("sendCurrencyエラー:", error);
      db.run("ROLLBACK", () => {
        res.status(400).json({ error: error.message });
      });
    }
  });
}

// 自分のトランザクション履歴を取得
async function getMyTransactions(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "認証情報がありません" });
    }

    const transactions = await transactionModel.getTransactionsByUserId(userId);
    return res.json(transactions);
  } catch (error) {
    console.error("getMyTransactionsエラー:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}
