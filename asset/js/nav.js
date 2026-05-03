import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { app } from "./firebase_config.js";

const auth = getAuth(app);

/**
 * Cập nhật navbar dựa trên trạng thái đăng nhập của user.
 * Gọi hàm này ở mỗi trang có navbar.
 *
 * HTML cần có sẵn trong .nav-right:
 *   <a id="nav-login-link" href="./login.html"><button id="login-btn">Login</button></a>
 *   <div id="nav-user-info" style="display:none">...</div>
 */
export function initNav() {
  onAuthStateChanged(auth, (user) => {
    const loginLink = document.getElementById("nav-login-link");
    const userInfo = document.getElementById("nav-user-info");

    if (!loginLink || !userInfo) return;

    if (user) {
      // Đã đăng nhập → ẩn Login, hiện thông tin user
      loginLink.style.display = "none";
      userInfo.style.display = "flex";

      // Hiển thị tên hoặc email
      const nameEl = document.getElementById("nav-user-name");
      if (nameEl) {
        nameEl.textContent = user.displayName || user.email || "User";
      }
    } else {
      // Chưa đăng nhập → hiện Login, ẩn thông tin user
      loginLink.style.display = "block";
      userInfo.style.display = "none";
    }
  });

  // Gán sự kiện Logout nếu có nút
  const logoutBtn = document.getElementById("nav-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
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
