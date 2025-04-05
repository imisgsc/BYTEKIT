import { auth } from "../firebase/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function toggleAuth() {
  const slider = document.querySelector(".slider");
  const current = slider.style.transform;
  slider.style.transform = current === "translateX(-50%)" ? "translateX(0%)" : "translateX(-50%)";
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "home.html";
    })
    .catch(error => alert(error.message));
}

function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful! Please login.");
      toggleAuth();
    })
    .catch(error => alert(error.message));
}

onAuthStateChanged(auth, (user) => {
  if (user && !window.location.pathname.includes("index.html")) {
    window.location.href = "home.html";
  }
});

window.toggleAuth = toggleAuth;
window.login = login;
window.signup = signup;
