// middlewares/errorHandler.js

module.exports = {
    errorHandler,
  };
  
  function errorHandler(err, req, res, next) {
    console.error("サーバーエラー発生:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
  