import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Lay the input tu file html
const emailElement = document.getElementById("email");
const passElement = document.getElementById("password");
// Lay the hien thi loi tu file html
const emailErrorElement = document.getElementById("email-error");
const passErrorElement = document.getElementById("pass-error");
// Lay nut login tu flie html
const loginButton = document.getElementById("login-button");

// Hàm xử lý đăng nhập Google
function handleGoogleLogin() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider(); // Tạo provider Google

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Google login successful:", user);
      window.location.href = "home.html"; // Chuyển đến trang home
    })
    .catch((error) => {
      console.error("Google login error:", error.message);
      passErrorElement.textContent = "(*) " + error.message;
    });
}

// Gắn sự kiện click cho nút Google
const googleButton = document.getElementById("google-login-btn");
googleButton.addEventListener("click", handleGoogleLogin);

// ham xu li su kien khi bam nut
function handleLoginClick(event) {
  event.preventDefault(); // Ngan chan hanh vi mac dinh cua button

  let email = emailElement.value.trim();
  let password = passElement.value.trim();

  if (validate(email, password) === true) {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful:", user);
        window.location.href = "home.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during login:", errorCode, errorMessage);
        passErrorElement.textContent = "(*) " + errorMessage;
      });
  }
}

// ham kiem tra thong tin nhap
function validate(email, password) {
  let isValid = true;
  let email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset error messages
  emailErrorElement.textContent = "";
  passErrorElement.textContent = "";

  // Validation
  if (!email_regex.test(email)) {
    emailErrorElement.textContent = "(*) Invalid email format.";
    isValid = false;
  }

  if (password === "") {
    passErrorElement.textContent =
      "(*) Password must be at least 6 characters.";
    isValid = false;
  }

  return isValid;
}

// gan su kien click cho button va ham xu ly su kien
loginButton.addEventListener("click", handleLoginClick);
