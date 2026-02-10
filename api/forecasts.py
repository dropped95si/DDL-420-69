import json
from datetime import datetime, timedelta

def handler(request):
    """Return forecast data for the last 30 days with realistic distribution."""

    # Pseudo-random walk generator
    def random_walk(length, start=0.5, volatility=0.08, trend=0.002):
        """Generate realistic probability walk with trend and volatility."""
        values = [start]
        for i in range(1, length):
            # Deterministic pseudo-random based on index
            seed = (i * 73 + 47) % 1000
            noise = (seed - 500) / 5000  # -0.1 to +0.1
            change = noise * volatility + trend
            new_val = max(0, min(1, values[-1] + change))
            values.append(new_val)
        return values

    # Generate 30-day forecast data
    accept_walk = random_walk(30, start=0.55, volatility=0.08, trend=0.001)
    reject_walk = random_walk(30, start=0.40, volatility=0.07, trend=-0.0005)
    continue_walk = random_walk(30, start=0.05, volatility=0.03, trend=0)

    forecasts = []
    for i in range(30):
        date = (datetime.now() - timedelta(days=30-i)).strftime('%Y-%m-%d')
        forecasts.append({
            "date": date,
            "accept": round(accept_walk[i], 4),
            "reject": round(reject_walk[i], 4),
            "continue": round(continue_walk[i], 4),
            "confidence": round(0.85 + (hash(date).__hash__() % 100) / 1000, 3)
        })

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Cache-Control": "max-age=300"},
        "body": json.dumps({
            "forecasts": forecasts,
            "total": len(forecasts),
            "span_days": 30,
            "generated_at": datetime.utcnow().isoformat()
        })
    }
