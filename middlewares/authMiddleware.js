// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

module.exports = {
  authMiddleware,
};

// 認証用ミドルウェア
function authMiddleware(req, res, next) {
  // Authorizationヘッダからトークンを取得 (例: "Bearer xxxxxxxx")
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "トークンがありません" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer "を除去
  if (!token) {
    return res.status(401).json({ error: "トークンが不正です" });
  }

  try {
    // トークンを検証
    const decoded = jwt.verify(token, JWT_SECRET);
    // 検証が通れば、req.userにデコード情報を格納
    req.user = decoded;
    next();
  } catch (error) {
    console.error("authMiddlewareエラー:", error);
    return res.status(401).json({ error: "トークンの検証に失敗しました" });
  }
}
