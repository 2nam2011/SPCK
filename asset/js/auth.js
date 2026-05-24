import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { loadCart } from "./cart.js";
import { app } from "./firebase_config.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User ready:", user.uid);

    loadCart(user.uid);
  } else {
    console.log("Chua dang nhap");
  }
});

export function getCurrentUser() {
  return auth.currentUser;
}
