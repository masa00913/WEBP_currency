// models/transactionModel.js
const db = require("../config/db");

module.exports = {
  createTransaction,
  getTransactionsByUserId,
};

// トランザクション(送金履歴)を登録する
function createTransaction(fromUserId, toUserId, amount, status = "completed") {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO transactions (from_user_id, to_user_id, amount, status)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [fromUserId, toUserId, amount, status], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

// あるユーザに関わるトランザクションを全件取得 (送金・受取)
function getTransactionsByUserId(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM transactions
      WHERE from_user_id = ? OR to_user_id = ?
      ORDER BY created_at DESC
    `;
    db.all(sql, [userId, userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
