import random
from datetime import datetime

class SignalDetector:
    def __init__(self):
        self.signal_violations = []
        self.traffic_signals = {
            "Wakad": {"status": "green", "cycle": 0},
            "Hinjawadi": {"status": "red", "cycle": 0},
            "Baner": {"status": "green", "cycle": 0},
            "Shivajinagar": {"status": "red", "cycle": 0}
        }
        print("🚦 Signal Detector Ready")

    def detect_signal_jump(self, camera_id, location, plate, speed=None):
        """Detect if a vehicle jumped a signal"""
        
        # Get current signal status
        signal = self.traffic_signals.get(location, {"status": "green"})
        
        # Random violation for demo
        if signal["status"] == "red" and random.random() < 0.3:
            violation = {
                "plate": plate,
                "camera_id": camera_id,
                "location": location,
                "timestamp": datetime.now().isoformat(),
                "signal_status": "RED",
                "speed": speed or random.randint(40, 80),
                "violation_type": "Signal Jump",
                "severity": "High"
            }
            self.signal_violations.append(violation)
            return violation
        
        # Mock violation for demo
        if random.random() < 0.05:  # 5% chance for demo
            violation = {
                "plate": f"MH{random.randint(10, 99)}{random.choice(['AB', 'CD', 'EF', 'GH', 'JK'])}{random.randint(1000, 9999)}",
                "camera_id": camera_id,
                "location": location,
                "timestamp": datetime.now().isoformat(),
                "signal_status": "RED",
                "speed": random.randint(45, 90),
                "violation_type": "Signal Jump",
                "severity": "High"
            }
            self.signal_violations.append(violation)
            return violation
        
        # Wrong way detection
        if random.random() < 0.03:  # 3% chance for demo
            violation = {
                "plate": f"MH{random.randint(10, 99)}{random.choice(['AB', 'CD', 'EF', 'GH', 'JK'])}{random.randint(1000, 9999)}",
                "camera_id": camera_id,
                "location": location,
                "timestamp": datetime.now().isoformat(),
                "signal_status": "N/A",
                "speed": random.randint(30, 60),
                "violation_type": "Wrong Way",
                "severity": "Critical"
            }
            self.signal_violations.append(violation)
            return violation
        
        return None

    def get_violations(self, limit=50):
        """Get recent signal violations"""
        return self.signal_violations[-limit:]

    def get_mock_violations(self):
        """Generate mock violations for demo"""
        mock_violations = [
            {
                "plate": "MH14AB1234",
                "camera_id": "CAM-001",
                "location": "Wakad",
                "timestamp": datetime.now().isoformat(),
                "signal_status": "RED",
                "speed": 65,
                "violation_type": "Signal Jump",
                "severity": "High"
            },
            {
                "plate": "MH12XY5678",
                "camera_id": "CAM-003",
                "location": "Baner",
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "signal_status": "RED",
                "speed": 72,
                "violation_type": "Signal Jump",
                "severity": "High"
            },
            {
                "plate": "MH14CD9999",
                "camera_id": "CAM-002",
                "location": "Hinjawadi",
                "timestamp": (datetime.now() - timedelta(minutes=10)).isoformat(),
                "signal_status": "N/A",
                "speed": 45,
                "violation_type": "Wrong Way",
                "severity": "Critical"
            }
        ]
        return mock_violations