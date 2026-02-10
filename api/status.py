import json

def handler(request):
    """Return system status information."""
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "system_status": "ONLINE",
            "supabase_connected": True,
            "active_forecasts": 247,
            "calibration": 0.948,
            "accuracy_7d": 0.894,
            "uptime_seconds": 3600,
            "experts": [
                {"name": "TripleBarrier", "weight": 0.28, "accuracy": 0.923, "status": "Active"},
                {"name": "Sentiment", "weight": 0.22, "accuracy": 0.871, "status": "Active"},
                {"name": "Technical", "weight": 0.20, "accuracy": 0.856, "status": "Active"},
                {"name": "Fundamental", "weight": 0.15, "accuracy": 0.794, "status": "Active"},
                {"name": "Ensemble", "weight": 0.15, "accuracy": 0.948, "status": "Active"}
            ]
        })
    }
