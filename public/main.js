// public/main.js

// ログイン後に取得したJWTトークンを保持するための変数
let token = null;

// ユーザ登録
async function registerUser() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  try {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "ユーザ登録に失敗しました");
    } else {
      alert(data.message || "ユーザ登録成功");
    }
  } catch (error) {
    console.error("registerUserエラー:", error);
  }
}

// ログイン
async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "ログインに失敗しました");
    } else {
      alert(data.message || "ログイン成功");
      // トークンを保持
      token = data.token;
    }
  } catch (error) {
    console.error("loginエラー:", error);
  }
}

// プロフィールを取得
async function getProfile() {
  if (!token) {
    alert("先にログインが必要です");
    return;
  }
  try {
    const res = await fetch("/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "プロフィール取得に失敗");
    } else {
      document.getElementById("profile-area").innerText = JSON.stringify(data);
    }
  } catch (error) {
    console.error("getProfileエラー:", error);
  }
}

// ウォレット残高を取得
async function getBalance() {
  if (!token) {
    alert("先にログインが必要です");
    return;
  }
  try {
    const res = await fetch("/api/wallets/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "残高取得に失敗");
    } else {
      document.getElementById("balance-area").innerText = `残高: ${data.balance}`;
    }
  } catch (error) {
    console.error("getBalanceエラー:", error);
  }
}

// 通貨送金
async function sendCurrency() {
  if (!token) {
    alert("先にログインが必要です");
    return;
  }

  const toUserId = document.getElementById("send-toUserId").value;
  const amount = document.getElementById("send-amount").value;

  try {
    const res = await fetch("/api/transactions/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toUserId, amount }),
    });
    const data = await res.json();
    if (!res.ok) {
      document.getElementById("send-result").innerText = data.error || "送金失敗";
    } else {
      document.getElementById("send-result").innerText = "送金成功";
    }
  } catch (error) {
    console.error("sendCurrencyエラー:", error);
  }
}

// 自分の取引履歴を取得
async function getTransactions() {
  if (!token) {
    alert("先にログインが必要です");
    return;
  }

  try {
    const res = await fetch("/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "取引履歴取得に失敗");
    } else {
      const list = document.getElementById("transaction-list");
      list.innerHTML = "";
      data.forEach((tx) => {
        const li = document.createElement("li");
        li.innerText = `ID:${tx.id} from:${tx.from_user_id} to:${tx.to_user_id} amount:${tx.amount} status:${tx.status}`;
        list.appendChild(li);
      });
    }
  } catch (error) {
    console.error("getTransactionsエラー:", error);
  }
}
