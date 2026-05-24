import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { app } from "./firebase_config.js";

const auth = getAuth(app);

export function initNav() {
  onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById("nav-login-link");
    const userInfo = document.getElementById("nav-user-info");

    if (user) {
      // Đã đăng nhập → ẩn Login, hiện thông tin user
      loginButton.style.display = "none";
      userInfo.style.display = "flex";

      // Hiển thị tên hoặc email
      const nameEl = document.getElementById("nav-user-name");
      if (nameEl) {
        nameEl.textContent = user.displayName || user.email || "User";
      }
    } else {
      // Chưa đăng nhập → hiện Login, ẩn thông tin user
      loginButton.style.display = "block";
      userInfo.style.display = "none";
    }
  });

  // Gán sự kiện Logout nếu có nút
  const logoutButton = document.getElementById("nav-logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.href = "./login.html";
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    });
  }
}
