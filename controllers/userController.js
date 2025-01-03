// controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const walletModel = require("../models/walletModel");

// JWT秘密鍵
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};

// ユーザ登録処理
async function registerUser(req, res) {
  try {
    // フロントから送られるデータ
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "ユーザ名とパスワードは必須です" });
    }

    // 既に同じusernameが存在しないか確認
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "このユーザ名は既に使用されています" });
    }

    // パスワードのハッシュ化
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // DBにユーザを作成
    const userId = await userModel.createUser(username, passwordHash);

    // 同時にウォレットも作成
    await walletModel.createWallet(userId);

    return res.status(201).json({ message: "ユーザ登録に成功しました", userId });
  } catch (error) {
    console.error("registerUserエラー:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}

// ログイン処理
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "ユーザ名とパスワードは必須です" });
    }

    // ユーザを取得
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "ユーザ名またはパスワードが正しくありません" });
    }

    // パスワードの検証
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "ユーザ名またはパスワードが正しくありません" });
    }

    // JWTの発行
    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, {
      expiresIn: "1h", // 1時間でトークン期限切れ（サンプル）
    });
    return res.json({ message: "ログイン成功", token });
  } catch (error) {
    console.error("loginUserエラー:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}

// ログインユーザのプロフィールを取得
async function getProfile(req, res) {
  try {
    // authMiddleware で解析済みのトークンから userId を取得
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "認証情報がありません" });
    }

    // DBからユーザ情報を取得
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "ユーザが存在しません" });
    }

    return res.json({
      id: user.id,
      username: user.username,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("getProfileエラー:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}
