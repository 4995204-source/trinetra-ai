import random
from datetime import datetime, timedelta

class TrafficAnalytics:
    def __init__(self):
        self.vehicle_count = {}
        self.hourly_data = {}
        self.camera_stats = {}
        print("📊 Traffic Analytics Ready")

    def generate_mock_analytics(self):
        """Generate mock analytics data for demo"""
        
        # Hourly traffic data
        hourly_traffic = []
        for hour in range(6, 21):
            if hour < 8:
                count = random.randint(100, 300)
            elif hour < 10:
                count = random.randint(500, 800)
            elif hour < 12:
                count = random.randint(800, 1200)
            elif hour < 14:
                count = random.randint(600, 900)
            elif hour < 17:
                count = random.randint(500, 800)
            elif hour < 19:
                count = random.randint(800, 1100)
            else:
                count = random.randint(300, 600)
            
            hourly_traffic.append({
                "hour": f"{hour}:00",
                "vehicles": count
            })
        
        # Vehicle types
        vehicle_types = [
            {"name": "Cars", "value": random.randint(4000, 6000)},
            {"name": "Bikes", "value": random.randint(2000, 4000)},
            {"name": "Buses", "value": random.randint(500, 1500)},
            {"name": "Trucks", "value": random.randint(300, 1000)},
            {"name": "Auto", "value": random.randint(1500, 3000)}
        ]
        
        # Camera stats
        camera_stats = {
            "Wakad": random.randint(1500, 3000),
            "Hinjawadi": random.randint(2000, 4000),
            "Baner": random.randint(1800, 3500),
            "Shivajinagar": random.randint(2500, 5000),
            "Aundh": random.randint(1000, 2000),
            "Pune Station": random.randint(1500, 3000)
        }
        
        # Congestion hotspots
        congestion_hotspots = [
            {"location": "Hinjawadi Phase 1", "traffic": "Heavy", "vehicles": random.randint(800, 1200), "time": "8-10 AM, 5-7 PM"},
            {"location": "Wakad Junction", "traffic": "Heavy", "vehicles": random.randint(600, 1000), "time": "9-11 AM, 6-8 PM"},
            {"location": "Baner Road", "traffic": "Medium", "vehicles": random.randint(400, 700), "time": "10 AM-12 PM"},
            {"location": "Shivajinagar", "traffic": "Medium", "vehicles": random.randint(500, 800), "time": "5-8 PM"}
        ]
        
        return {
            "hourly_traffic": hourly_traffic,
            "vehicle_types": vehicle_types,
            "camera_stats": camera_stats,
            "congestion_hotspots": congestion_hotspots,
            "total_vehicles": sum(camera_stats.values()),
            "peak_hour": "5-6 PM",
            "peak_vehicles": 1100
        }

    def get_analytics(self):
        """Get analytics data"""
        return self.generate_mock_analytics()

    def get_vehicle_count_by_camera(self, camera_name):
        """Get vehicle count for a specific camera"""
        return random.randint(100, 500)