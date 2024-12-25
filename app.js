// app.js
require("dotenv").config(); // .env ファイルの読み込み
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// JSONボディを扱うための設定
app.use(express.json());

// 静的ファイルの配信設定（publicディレクトリ）
app.use(express.static("public"));

// ルーティングの読み込み
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// ルーティングのマウント
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);

// エラーハンドリング用ミドルウェア
const { errorHandler } = require("./middlewares/errorHandler");
app.use(errorHandler);

// サーバ起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
