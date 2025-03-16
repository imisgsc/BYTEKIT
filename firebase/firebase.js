// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration
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
const auth = getAuth(app);         // Firebase Authentication
const db = getFirestore(app);      // Firestore Database

// Export Firebase instances for use in other files
export { auth, db };
