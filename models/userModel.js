// models/userModel.js
const db = require("../config/db");

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};

// 新規ユーザをDBに作成する
function createUser(username, passwordHash) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
    db.run(sql, [username, passwordHash], function (err) {
      if (err) {
        return reject(err);
      }
      // this.lastID で INSERT されたレコードのIDを取得できる
      resolve(this.lastID);
    });
  });
}

// usernameからユーザを検索
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

// idからユーザを検索
function findUserById(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}
