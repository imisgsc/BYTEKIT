import { db } from "./firebase.js";
import {
    collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const urlCollection = collection(db, "url");

let allUrls = [];

async function fetchData() {
    const querySnapshot = await getDocs(urlCollection);
    allUrls = [];

    querySnapshot.forEach((doc) => {
        allUrls.push({
            id: doc.id,
            ...doc.data()
        });
    });

    updateStats();
    renderCharts();
    renderTable();
}

function updateStats() {
    const totalUrls = allUrls.length;
    const totalClicks = allUrls.reduce((sum, url) => sum + (url.clickCount || 0), 0);
    const avgClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0;

    const topUrlObj = allUrls.reduce((max, url) =>
        (url.clickCount || 0) > (max.clickCount || 0) ? url : max, {});
    
    const recentUrlObj = allUrls.reduce((latest, url) =>
        (!latest || (url.lastCopiedAt?.seconds || 0) > (latest.lastCopiedAt?.seconds || 0)) ? url : latest, null);

    document.getElementById("total-urls").querySelector("span").textContent = totalUrls;
    document.getElementById("total-clicks").querySelector("span").textContent = totalClicks;
    document.getElementById("avg-clicks").querySelector("span").textContent = avgClicks;

    document.getElementById("top-url").querySelector("span").textContent = topUrlObj?.shortUrl || "-";
    document.getElementById("recent-url").querySelector("span").textContent = recentUrlObj?.shortUrl || "-";
}

function renderCharts() {
    const clickDates = {};
    allUrls.forEach(url => {
        if (url.lastCopiedAt) {
            const date = new Date(url.lastCopiedAt.seconds * 1000).toLocaleDateString();
            clickDates[date] = (clickDates[date] || 0) + url.clickCount;
        }
    });

    const dateLabels = Object.keys(clickDates).sort((a, b) => new Date(a) - new Date(b));
    const clickCounts = dateLabels.map(date => clickDates[date]);

    const ctx = document.getElementById('clicksOverTimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Clicks',
                data: clickCounts,
                borderColor: '#001E6C',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#001E6C'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}


function renderTable() {
    const tableBody = document.getElementById('recent-urls-body');
    tableBody.innerHTML = "";

    const sortedUrls = [...allUrls].sort((a, b) => {
        const aTime = a.lastCopiedAt?.seconds || 0;
        const bTime = b.lastCopiedAt?.seconds || 0;
        return bTime - aTime;
    });

    sortedUrls.slice(0, 10).forEach(url => {
        const tr = document.createElement("tr");

        const originalTd = document.createElement("td");
        originalTd.textContent = url.originalUrl;

        const shortTd = document.createElement("td");
        shortTd.textContent = url.shortUrl;

        const clicksTd = document.createElement("td");
        clicksTd.textContent = url.clickCount || 0;

        const timeTd = document.createElement("td");
        const date = url.lastCopiedAt ? new Date(url.lastCopiedAt.seconds * 1000) : "-";
        timeTd.textContent = date instanceof Date ? date.toLocaleString() : "-";

        tr.appendChild(originalTd);
        tr.appendChild(shortTd);
        tr.appendChild(clicksTd);
        tr.appendChild(timeTd);

        tableBody.appendChild(tr);
    });
}

fetchData();
