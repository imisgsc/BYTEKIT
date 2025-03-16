import { auth } from "../firebase/firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Display User Email in Navbar
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-email").textContent = user.email;
    } else {
        window.location.href = "index.html"; // Redirect if not logged in
    }
});

// Logout Function
function logout() {
    signOut(auth)
        .then(() => window.location.href = "index.html")
        .catch(error => alert("Logout failed: " + error.message));
}

// Page Redirection
function redirectTo(page) {
    window.location.href = page;
}

window.logout = logout;
window.redirectTo = redirectTo;
