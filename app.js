require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// JSONボディを扱うための設定
app.use(express.json());

// セッション設定 (例: secret や resave, saveUninitialized など)
app.use(session({
  secret: "my_secret_key", 
  resave: false,
  saveUninitialized: true,
}));

// 静的ファイルを配信
// 例: app.use(express.static("public")) しておくと、public直下のファイルに直接アクセス可能
app.use(express.static("public"));

// ログイン判定用ミドルウェア (例)
function checkLoginStatus(req, res, next) {
  // req.session に userId があればログイン済みとみなす
  if (req.session.userId) {
    // ログイン済み
    next();
  } else {
    // 未ログイン
    return res.redirect("/login"); 
    // ここで "/login" にGETしたときに login.html を返すようにする
  }
}

// (1) ログインページを返す
app.get("/login", (req, res) => {
  // もしログイン済みならリダイレクトしても良い
  if (req.session.userId) {
    return res.redirect("/home");
  }
  // login.html を返す
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// (2) ホームページを返す (ログイン必須)
app.get("/home", checkLoginStatus, (req, res) => {
  // checkLoginStatus がnext()を呼んでいればログイン済み
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// ルート ("/") にアクセスした場合
app.get("/", (req, res) => {
  // ログイン状態で出し分け
  if (req.session.userId) {
    // ログイン済みなら /home に飛ばす
    return res.redirect("/home");
  } else {
    // 未ログインなら /login に飛ばす
    return res.redirect("/login");
  }
});

// ログイン処理 (POST)
app.post("/api/login", (req, res) => {
  // ここでは例としてユーザ名とパスワードをチェックする
  const { username, password } = req.body;
  // バリデーション & データベースでユーザ確認 etc...
  
  // ログイン成功と判断したらセッションにuserIdを保存
  req.session.userId = 123; // 例: 本来はユーザIDなどを保存
  return res.json({ message: "ログイン成功" });
});

// ログアウト処理
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "セッション破棄に失敗" });
    }
    // セッションが破棄されたので未ログイン状態
    return res.json({ message: "ログアウト成功" });
  });
});

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