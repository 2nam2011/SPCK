import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAcsZK8Z80-DJ10dn2L85ZWn5F9KqaSSU",
  authDomain: "coffee-2nam-1bdd9.firebaseapp.com",
  projectId: "coffee-2nam-1bdd9",
  storageBucket: "coffee-2nam-1bdd9.firebasestorage.app",
  messagingSenderId: "951608688588",
  appId: "1:951608688588:web:7ba81008cca63be39c2769",
};

const app = initializeApp(firebaseConfig);
console.log(app.name);
export { app };
