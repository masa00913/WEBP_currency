// config/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// .env からDBパスを読み込む
const dbPath = process.env.DB_PATH || "./database/db.sqlite3";

// データベースファイルに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("データベース接続エラー: ", err.message);
  } else {
    console.log("SQLite3 データベースに接続しました:", dbPath);
  }
});

// 初回起動時などにテーブル作成 (必要に応じて)
db.serialize(() => {
  // usersテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // walletsテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      balance INTEGER DEFAULT 0, -- 通貨を整数(最小単位)で管理
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // transactionsテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id)   REFERENCES users(id)
    );
  `);
});

module.exports = db;
