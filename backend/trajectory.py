from datetime import datetime
import random

class TrajectoryTracker:
    def __init__(self):
        self.vehicle_trajectories = {}
        self.detection_history = []
        print("🗺️ Trajectory Tracker Ready")

    def add_detection(self, plate, camera_id, location, lat, lng, timestamp=None):
        """Add a detection for trajectory tracking"""
        if timestamp is None:
            timestamp = datetime.now().isoformat()
        
        detection = {
            "plate": plate,
            "camera_id": camera_id,
            "location": location,
            "latitude": lat,
            "longitude": lng,
            "timestamp": timestamp
        }
        
        self.detection_history.append(detection)
        
        if plate not in self.vehicle_trajectories:
            self.vehicle_trajectories[plate] = []
        
        self.vehicle_trajectories[plate].append(detection)
        return detection

    def get_trajectory(self, plate):
        """Get full trajectory of a vehicle"""
        if plate not in self.vehicle_trajectories:
            return []
        
        # Sort by timestamp
        trajectory = sorted(
            self.vehicle_trajectories[plate],
            key=lambda x: x["timestamp"]
        )
        return trajectory

    def get_mock_trajectory(self, plate="MH14AB1234"):
        """Generate mock trajectory data for demo"""
        mock_locations = [
            {"name": "Wakad", "lat": 18.5990, "lng": 73.7637},
            {"name": "Hinjawadi", "lat": 18.5912, "lng": 73.7389},
            {"name": "Baner", "lat": 18.5590, "lng": 73.7868},
            {"name": "Shivajinagar", "lat": 18.5300, "lng": 73.8500},
            {"name": "Aundh", "lat": 18.5580, "lng": 73.8070},
            {"name": "Pune Station", "lat": 18.5300, "lng": 73.8700}
        ]
        
        trajectory = []
        base_time = datetime.now()
        
        for i, loc in enumerate(mock_locations[:4]):
            detection = {
                "plate": plate,
                "camera_id": f"CAM-{i+1:03d}",
                "location": loc["name"],
                "latitude": loc["lat"],
                "longitude": loc["lng"],
                "timestamp": (base_time.replace(minute=base_time.minute + i*10)).isoformat(),
                "confidence": round(random.uniform(0.85, 0.98), 3)
            }
            trajectory.append(detection)
        
        return trajectory

    def predict_next_location(self, plate):
        """Predict next location based on trajectory"""
        trajectory = self.get_trajectory(plate)
        if len(trajectory) < 2:
            return None
        
        # Simple prediction based on last location
        last = trajectory[-1]
        # Mock predictions
        predictions = [
            {"location": "Shivajinagar", "probability": 0.78},
            {"location": "Aundh", "probability": 0.15},
            {"location": "Pune Station", "probability": 0.07}
        ]
        return predictions