import json
from datetime import datetime, timedelta

def handler(request):
    """Return recent system events."""
    
    events = [
        {
            "timestamp": (datetime.now() - timedelta(minutes=2)).isoformat(),
            "type": "forecast",
            "title": "Forecast Generated",
            "description": "AAPL: P(REJECT) = 0.73 +/- 0.04 [5D]"
        },
        {
            "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
            "type": "weight_update",
            "title": "Weight Update",
            "description": "TripleBarrier: 0.27 -> 0.28 (+3.7%)"
        },
        {
            "timestamp": (datetime.now() - timedelta(minutes=12)).isoformat(),
            "type": "outcome",
            "title": "Outcome Recorded",
            "description": "MSFT: Realized P(ACCEPT) - Calibrated"
        },
        {
            "timestamp": (datetime.now() - timedelta(minutes=18)).isoformat(),
            "type": "ingest",
            "title": "Data Ingest",
            "description": "Processed 3,247 bars from Polygon"
        },
        {
            "timestamp": (datetime.now() - timedelta(minutes=25)).isoformat(),
            "type": "forecast",
            "title": "Forecast Generated",
            "description": "GOOGL: P(ACCEPT) = 0.62 +/- 0.06 [10D]"
        }
    ]
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "events": events,
            "total": len(events)
        })
    }
