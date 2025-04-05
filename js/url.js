import { db } from "./firebase.js";
import { 
    collection, addDoc, doc, deleteDoc, query, where, getDocs, updateDoc, increment 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

async function generateShortURL() {
    const originalUrl = document.getElementById('original-url').value;
    if (originalUrl === '') {
        alert('Please enter a valid URL');
        return;
    }

    const shortUrl = 'bytekit-' + Math.random().toString(36).substring(2, 8);
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    try {
        await addDoc(collection(db, "url"), {
            originalUrl: originalUrl,
            shortUrl: shortUrl,
            expiryTime: expiryTime,
            clickCount: 0 // Initialize click count
        });

        document.getElementById('shortened-url').textContent = `https://bytekit.com/${shortUrl}`;
        document.getElementById('result-container').style.display = 'block';
        startCountdown(expiryTime, shortUrl);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function deleteExpiredLink(shortUrl) {
    const q = query(collection(db, "url"), where("shortUrl", "==", shortUrl));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "url", docSnap.id));
        console.log(`Deleted expired URL: ${shortUrl}`);
    });
}

function startCountdown(expiryTime, shortUrl) {
    let timeLeft = Math.floor((expiryTime - Date.now()) / 1000); // Remaining time in seconds
    const countdownInterval = setInterval(async () => {
        const now = Date.now();
        timeLeft = Math.max(Math.floor((expiryTime - now) / 1000), 0);

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('shortened-url').textContent = 'Link Expired';
            await deleteExpiredLink(shortUrl);
        }
    }, 1000);
}

async function copyToClipboard() {
    const textToCopy = document.getElementById('shortened-url').textContent;
    navigator.clipboard.writeText(textToCopy).then(async () => {
        alert('Shortened URL copied to clipboard');

        // Extract short code
        const shortCode = textToCopy.split('/').pop();

        // Find matching doc in Firestore
        const q = query(collection(db, "url"), where("shortUrl", "==", shortCode));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (docSnap) => {
            const docRef = doc(db, "url", docSnap.id);
            await updateDoc(docRef, {
                clickCount: increment(1)
            });
        });
    });
}

document.getElementById('generate-btn').addEventListener('click', generateShortURL);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
document.getElementById('reset-btn').addEventListener('click', () => location.reload());
document.getElementById('regenerate-btn').addEventListener('click', generateShortURL);
