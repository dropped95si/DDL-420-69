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
    
    document.getElementById('uptime').textContent = display;
}, 1000);

// Forecast Chart
const ctx1 = document.getElementById('forecastChart');
if (ctx1) {
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i - 29).map(i => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            }),
            datasets: [
                {
                    label: 'P(ACCEPT)',
                    data: generateWalk(30, 0.55, 0.05),
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
                    data: generateWalk(30, 0.40, 0.05),
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
                    data: generateWalk(30, 0.05, 0.02),
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
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: 'rgba(30, 40, 71, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888fa0',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return (value * 100) + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888fa0',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Calibration Chart
const ctx2 = document.getElementById('calibrationChart');
if (ctx2) {
    const calData = generateCalibrationData(10);
    
    new Chart(ctx2, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Actual vs Predicted',
                    data: calData,
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
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 1,
                    grid: {
                        color: 'rgba(30, 40, 71, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888fa0',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return (value * 100) + '%';
                        }
                    }
                },
                y: {
                    min: 0,
                    max: 1,
                    grid: {
                        color: 'rgba(30, 40, 71, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888fa0',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return (value * 100) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Utility: Random walk generator
function generateWalk(length, start, volatility) {
    const data = [];
    let value = start;
    
    for (let i = 0; i < length; i++) {
        const change = (Math.random() - 0.5) * volatility * 2;
        value = Math.max(0, Math.min(1, value + change));
        data.push(value);
    }
    
    return data;
}

// Utility: Generate calibration data
function generateCalibrationData(bins) {
    const data = [];
    
    for (let i = 0; i < bins; i++) {
        const predicted = i / bins;
        const actual = predicted + (Math.random() - 0.5) * 0.08;
        data.push({
            x: predicted,
            y: Math.max(0, Math.min(1, actual))
        });
    }
    
    return data;
}

// Log initialization
console.log('[DDL-69] UI Dashboard loaded');
console.log('[DDL-69] System status: ONLINE');
console.log('[DDL-69] Probability ensemble initialized');
