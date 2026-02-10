import json
from datetime import datetime, timedelta

def handler(request):
    """Return forecast data for the last 30 days."""
    
    # Generate sample forecast data
    forecasts = []
    for i in range(30):
        date = (datetime.now() - timedelta(days=30-i)).strftime('%Y-%m-%d')
        base = 0.5 + (i / 60)  # base value that increases slightly
        forecasts.append({
            "date": date,
            "accept": max(0, min(1, base + 0.05 * (hash(date) % 10 - 5) / 10)),
            "reject": max(0, min(1, 0.4 + 0.05 * (hash(date) % 10 - 5) / 10)),
            "continue": max(0, min(1, 0.05 + 0.02 * (hash(date) % 10 - 5) / 10))
        })
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "forecasts": forecasts,
            "total": len(forecasts),
            "span_days": 30
        })
    }
