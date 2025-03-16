// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdyz4kftzu0qiuYQdWRFMNevkznniiuWc",
  authDomain: "bytekit-a9fda.firebaseapp.com",
  projectId: "bytekit-a9fda",
  storageBucket: "bytekit-a9fda.firebasestorage.app",
  messagingSenderId: "618108439801",
  appId: "1:618108439801:web:22fab029922bf401f3e628"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore & Auth
export { db, auth };
