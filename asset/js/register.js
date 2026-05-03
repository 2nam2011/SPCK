import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const emailElement = document.getElementById("email");
const emailErrorElement = document.getElementById("email-error");

const pass1Element = document.getElementById("password");
const pass1ErrorElement = document.getElementById("pass1-error");

const pass2Element = document.getElementById("repassword");
const pass2ErrorElement = document.getElementById("pass2-error");

const registerButton = document.getElementById("register-button");

function handleRegister(event) {
  event.preventDefault(); // Ngan chan hanh vi mac dinh của button

  let email = emailElement.value.trim();
  let password = pass1Element.value.trim();
  let repassword = pass2Element.value.trim();

  if (validate(email, password, repassword)) {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful:", user);
        window.location.href = "home.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during login:", errorCode, errorMessage);
        pass1ErrorElement.textContent = "(*) " + errorMessage;
      });
  }
}

function validate(email, pass1, pass2) {
  let isValidate = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  emailErrorElement.textContent = "";
  pass1ErrorElement.textContent = "";
  pass2ErrorElement.textContent = "";

  if (!emailRegex.test(email)) {
    emailErrorElement.textContent = "(*) Invalid email format.";
    isValidate = false;
  }

  if (pass1 === "") {
    pass1ErrorElement.textContent = "(*) Password cannot be empty.";
    isValidate = false;
  }

  if (pass2 === "") {
    pass2ErrorElement.textContent = "(*) Re-password cannot be empty.";
    isValidate = false;
  }

  if (pass1 !== "" && pass2 !== "" && pass1 !== pass2) {
    pass2ErrorElement.textContent = "(*) Passwords do not match.";
    isValidate = false;
  }

  return isValidate;
}

registerButton.addEventListener("click", handleRegister);
