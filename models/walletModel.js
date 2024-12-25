// models/walletModel.js
const db = require("../config/db");

module.exports = {
  createWallet,
  getWalletByUserId,
  updateWalletBalance,
};

// ユーザが作成されたタイミングなどで呼ぶ想定
function createWallet(userId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO wallets (user_id, balance) VALUES (?, 0)`;
    db.run(sql, [userId], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

// user_id からウォレットを取得
function getWalletByUserId(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wallets WHERE user_id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

// ウォレット残高を更新 (加算・減算)
function updateWalletBalance(walletId, newBalance) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [newBalance, walletId], function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
