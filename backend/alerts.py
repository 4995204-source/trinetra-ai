from datetime import datetime
import random

class AlertSystem:
    def __init__(self):
        self.alerts = []
        self.watchlist = []
        print("🔔 Alert System Ready")

    def generate_alert(self, alert_type, priority, vehicle_number, camera_id, location, reason, details=None):
        """Generate a new alert"""
        alert = {
            "id": len(self.alerts) + 1,
            "type": alert_type,
            "priority": priority,
            "vehicle_number": vehicle_number,
            "camera_id": camera_id,
            "location": location,
            "timestamp": datetime.now().isoformat(),
            "reason": reason,
            "details": details,
            "status": "active"
        }
        self.alerts.append(alert)
        return alert

    def get_active_alerts(self):
        """Get all active alerts"""
        return [alert for alert in self.alerts if alert["status"] == "active"]

    def get_mock_alerts(self):
        """Generate mock alerts for demo"""
        mock_alerts = [
            {
                "id": 1,
                "type": "watchlist",
                "priority": "critical",
                "vehicle_number": "MH14AB1234",
                "camera_id": "CAM-003",
                "location": "Baner Road",
                "timestamp": datetime.now().isoformat(),
                "confidence": 97,
                "reason": "Stolen Vehicle - Reported 2 days ago",
                "status": "active",
                "details": "Vehicle reported stolen from Wakad area. High priority alert issued."
            },
            {
                "id": 2,
                "type": "alert",
                "priority": "high",
                "vehicle_number": "MH12XY5678",
                "camera_id": "CAM-001",
                "location": "Wakad Junction",
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "confidence": 94,
                "reason": "Suspicious movement pattern detected",
                "status": "active"
            },
            {
                "id": 3,
                "type": "alert",
                "priority": "medium",
                "vehicle_number": "MH14CD9999",
                "camera_id": "CAM-002",
                "location": "Hinjawadi Phase 1",
                "timestamp": (datetime.now() - timedelta(minutes=10)).isoformat(),
                "confidence": 88,
                "reason": "Vehicle involved in previous incident",
                "status": "reviewed"
            },
            {
                "id": 4,
                "type": "watchlist",
                "priority": "high",
                "vehicle_number": "MH14PQ7890",
                "camera_id": "CAM-010",
                "location": "Hadapsar",
                "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
                "confidence": 95,
                "reason": "Watchlist match - Hit & run case",
                "status": "active",
                "details": "Vehicle identified as suspect in hit and run case"
            }
        ]
        return mock_alerts