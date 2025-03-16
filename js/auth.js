import { auth } from "../firebase/firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Toggle between Login & Signup forms
function toggleAuth() {
    const slider = document.querySelector(".slider");
    slider.style.transform = slider.style.transform === "translateX(-50%)" ? "translateX(0)" : "translateX(-50%)";
}

// Login Function
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful!");
            window.location.href = "home.html"; // Redirect to Home Page
        })
        .catch(error => alert(error.message));
}

// Signup Function (Redirects to Login Card Instead of Home)
function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Signup successful! Please login."); // Show success message
            toggleAuth(); // Switch back to Login form
        })
        .catch(error => alert(error.message));
}

// Keep user logged in (Only after Login)
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (window.location.pathname.includes("index.html")) {
            return; // Do not auto-redirect on signup, only after login
        }
        window.location.href = "home.html"; // Redirect to Home Page only after login
    }
});

window.toggleAuth = toggleAuth;
window.login = login;
window.signup = signup;
