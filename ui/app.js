// Initialize uptime counter
let startTime = Date.now();
setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let display = '';
    const days = Math.floor(elapsed / 86400);
    const hours = Math.floor((elapsed % 86400) / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);

    if (days > 0) display += days + 'd ';
    if (hours > 0) display += hours + 'h ';
    display += minutes + 'm';

    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) uptimeEl.textContent = display;
}, 1000);

// API Helper Functions
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`[DDL-69] API Error (${endpoint}):`, error.message);
        return null;
    }
}

// Load all dashboard data
async function loadDashboardData() {
    const [forecasts, status, calibration, events] = await Promise.all([
        fetchAPI('/api/forecasts'),
        fetchAPI('/api/status'),
        fetchAPI('/api/calibration'),
        fetchAPI('/api/events')
    ]);

    if (forecasts && forecasts.forecasts?.length) {
        currentForecasts = forecasts.forecasts;
    } else {
        currentForecasts = sampleForecasts;
    }

    initForecastChart(currentForecasts || []);
    renderForecastList(currentForecasts || []);

    if (calibration) initCalibrationChart(calibration.calibration_curve || []);
    if (events) loadEventsStream(events.events || []);
}

// Initialize Forecast Chart
function initForecastChart(forecasts) {
    const ctx = document.getElementById('forecastChart');
    if (!ctx || forecasts.length === 0) return;

    const labels = forecasts.map(f => {
        const date = new Date(f.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const acceptData = forecasts.map(f => f.accept);
    const rejectData = forecasts.map(f => f.reject);
    const continueData = forecasts.map(f => f.continue);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'P(ACCEPT)',
                    data: acceptData,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#111a3a',
                },
                {
                    label: 'P(REJECT)',
                    data: rejectData,
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#ff6b9d',
                    pointBorderColor: '#111a3a',
                },
                {
                    label: 'P(CONTINUE)',
                    data: continueData,
                    borderColor: '#00d9ff',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#00d9ff',
                    pointBorderColor: '#111a3a',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#e0e6ff',
                        padding: 15,
                        font: { size: 12, weight: '500' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: { color: 'rgba(30, 40, 71, 0.5)', drawBorder: false },
                    ticks: {
                        color: '#888fa0',
                        font: { size: 11 },
                        callback: function(value) { return (value * 100) + '%'; }
                    }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#888fa0', font: { size: 11 } }
                }
            }
        }
    });
}

// Initialize Calibration Chart
function initCalibrationChart(calibrationData) {
    const ctx = document.getElementById('calibrationChart');
    if (!ctx || calibrationData.length === 0) return;

    const data = calibrationData.map(item => ({
        x: item.predicted,
        y: item.actual
    }));

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Actual vs Predicted',
                    data: data,
                    borderColor: '#00d9ff',
                    backgroundColor: 'rgba(0, 217, 255, 0.3)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Perfect Calibration',
                    data: [{x: 0, y: 0}, {x: 1, y: 1}],
                    borderColor: '#888fa0',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    showLine: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#e0e6ff',
                        padding: 15,
                        font: { size: 12, weight: '500' }
                    }
                }
            },
            scales: {
                x: {
                    min: 0, max: 1,
                    grid: { color: 'rgba(30, 40, 71, 0.5)', drawBorder: false },
                    ticks: {
                        color: '#888fa0',
                        font: { size: 11 },
                        callback: function(value) { return (value * 100) + '%'; }
                    }
                },
                y: {
                    min: 0, max: 1,
                    grid: { color: 'rgba(30, 40, 71, 0.5)', drawBorder: false },
                    ticks: {
                        color: '#888fa0',
                        font: { size: 11 },
                        callback: function(value) { return (value * 100) + '%'; }
                    }
                }
            }
        }
    });
}

// Load events stream
function loadEventsStream(events) {
    const eventsList = document.querySelector('.events-list');
    if (!eventsList || events.length === 0) return;

    eventsList.innerHTML = '';
    events.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event';

        const timeEl = new Date(event.timestamp);
        const now = new Date();
        const diffMs = now - timeEl;
        const diffMins = Math.floor(diffMs / 60000);

        let timeStr = `${diffMins}m`;
        if (diffMins < 1) timeStr = 'now';
        else if (diffMins >= 60) timeStr = `${Math.floor(diffMins / 60)}h`;

        eventEl.innerHTML = `
            <div class="event-time">${timeStr}</div>
            <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-desc">${event.description}</div>
            </div>
        `;

        eventsList.appendChild(eventEl);
    });
}

// Auto-refresh dashboard every 5 minutes
loadDashboardData();
setInterval(loadDashboardData, 5 * 60 * 1000);

// Log initialization
console.log('[DDL-69] Dashboard initialized');
console.log('[DDL-69] API Version: v0.2.0');
console.log('[DDL-69] Auto-refresh: 5 minutes');

// ---------- Forecast list + fallback ----------

const sampleForecasts = [
    { ticker: 'AAPL', accept: 0.72, reject: 0.18, continue: 0.10, date: '2026-02-10T14:00:00Z', label: 'Earnings drift up' },
    { ticker: 'MSFT', accept: 0.64, reject: 0.22, continue: 0.14, date: '2026-02-10T14:00:00Z', label: 'Cloud beat probability' },
    { ticker: 'NVDA', accept: 0.58, reject: 0.30, continue: 0.12, date: '2026-02-10T14:00:00Z', label: 'Gamma squeeze risk' },
    { ticker: 'TSLA', accept: 0.41, reject: 0.45, continue: 0.14, date: '2026-02-10T14:00:00Z', label: 'Range-bound after delivery miss' },
    { ticker: 'AMZN', accept: 0.55, reject: 0.28, continue: 0.17, date: '2026-02-10T14:00:00Z', label: 'Retail strength, ad growth' }
];

let currentForecasts = sampleForecasts;

function renderForecastList(forecasts) {
    const tbody = document.getElementById('forecastTableBody');
    const countEl = document.getElementById('forecastCount');
    if (!tbody) return;

    tbody.innerHTML = '';
    (forecasts || []).forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${f.ticker || '—'}</td>
            <td>${(f.accept ?? 0).toFixed(2)}</td>
            <td>${(f.reject ?? 0).toFixed(2)}</td>
            <td>${(f.continue ?? 0).toFixed(2)}</td>
            <td>${f.label || '—'}</td>
            <td>${new Date(f.date).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
    if (countEl) countEl.textContent = forecasts?.length ?? 0;
}

function openForecastModal() {
    const modal = document.getElementById('forecastModal');
    if (modal) modal.classList.add('open');
    renderForecastList(currentForecasts);
}

function closeForecastModal() {
    const modal = document.getElementById('forecastModal');
    if (modal) modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('forecastsCard');
    const closeBtn = document.getElementById('forecastModalClose');
    if (card) card.addEventListener('click', openForecastModal);
    if (closeBtn) closeBtn.addEventListener('click', closeForecastModal);
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeForecastModal();
    });
});
