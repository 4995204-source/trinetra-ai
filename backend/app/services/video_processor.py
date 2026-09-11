import cv2
import numpy as np
import pytesseract
from datetime import datetime
from typing import List, Dict, Any
import os
import re
from ultralytics import YOLO

# Configure Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class VideoProcessor:
    def __init__(self):
        # Load YOLO model for vehicle detection
        print("Loading YOLO model...")
        self.model = YOLO('yolov8n.pt')  # Nano model for speed
        print("YOLO model loaded successfully!")
        
        # Vehicle classes in YOLO
        self.vehicle_classes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle']
        
        # Track previous frames for speed calculation
        self.tracks = {}
        self.track_id = 0
    
    def process_video(self, video_path: str) -> Dict[str, Any]:
        """Process video file for vehicle detection and ANPR"""
        
        results = {
            "vehicles_detected": [],
            "total_frames": 0,
            "processing_time": 0,
            "average_speed": 0,
            "max_speed": 0,
            "total_vehicles": 0,
            "detected_plates": []
        }
        
        cap = cv2.VideoCapture(video_path)
        
        # Check if video opened successfully
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0:
            fps = 30  # Default to 30fps
        
        frame_count = 0
        detections = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process every 5th frame for efficiency
            if frame_count % 5 == 0:
                # Detect vehicles using YOLO
                vehicles = self._detect_vehicles_yolo(frame)
                
                current_time = frame_count / fps
                
                for vehicle in vehicles:
                    x, y, w, h = vehicle["bbox"]
                    
                    # Extract ROI for ANPR
                    roi = frame[y:y+h, x:x+w]
                    
                    # Read license plate
                    plate_number = self._read_plate(roi)
                    
                    # Calculate speed
                    speed = self._calculate_speed(vehicle["centroid"], vehicle["id"], current_time)
                    
                    detection = {
                        "frame": frame_count,
                        "timestamp": round(current_time, 2),
                        "bbox": [int(x), int(y), int(w), int(h)],
                        "centroid": [int(vehicle["centroid"][0]), int(vehicle["centroid"][1])],
                        "plate_number": plate_number,
                        "speed": round(speed, 2),
                        "confidence": round(vehicle["confidence"], 2),
                        "vehicle_type": vehicle["type"],
                        "track_id": vehicle["id"]
                    }
                    
                    detections.append(detection)
                    
                    # Add plate to detected plates list
                    if plate_number and plate_number != "UNKNOWN":
                        results["detected_plates"].append({
                            "plate": plate_number,
                            "timestamp": detection["timestamp"],
                            "speed": detection["speed"]
                        })
        
        cap.release()
        
        # Calculate statistics
        if detections:
            speeds = [d["speed"] for d in detections if d["speed"] > 0]
            if speeds:
                results["average_speed"] = round(sum(speeds) / len(speeds), 2)
                results["max_speed"] = round(max(speeds), 2)
        
        results["vehicles_detected"] = detections
        results["total_frames"] = frame_count
        results["total_vehicles"] = len(detections)
        
        return results
    
    def _detect_vehicles_yolo(self, frame: np.ndarray) -> List[Dict]:
        """Detect vehicles using YOLO"""
        vehicles = []
        
        try:
            # Run YOLO detection
            results = self.model(frame, verbose=False)
            
            for result in results:
                if result.boxes is None:
                    continue
                
                for box in result.boxes:
                    # Get class name
                    class_id = int(box.cls[0])
                    class_name = result.names[class_id]
                    
                    # Check if it's a vehicle
                    if class_name in self.vehicle_classes:
                        # Get bounding box
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        w = int(x2 - x1)
                        h = int(y2 - y1)
                        x = int(x1)
                        y = int(y1)
                        
                        # Calculate centroid
                        centroid_x = x + w // 2
                        centroid_y = y + h // 2
                        
                        # Get confidence
                        confidence = float(box.conf[0])
                        
                        # Track the vehicle
                        track_id = self._track_vehicle(centroid_x, centroid_y, confidence)
                        
                        vehicles.append({
                            "bbox": [x, y, w, h],
                            "centroid": [centroid_x, centroid_y],
                            "confidence": confidence,
                            "type": class_name,
                            "id": track_id
                        })
        except Exception as e:
            print(f"Error in YOLO detection: {e}")
        
        return vehicles
    
    def _track_vehicle(self, centroid_x: int, centroid_y: int, confidence: float) -> int:
        """Track vehicle across frames using simple centroid tracking"""
        # For simplicity, return a new track ID
        # In production, you'd use a proper tracking algorithm like DeepSORT
        
        # Check if we have any active tracks
        best_match = None
        min_distance = 100  # Maximum distance to match
        
        for track_id, track_data in self.tracks.items():
            last_pos = track_data['last_position']
            distance = np.sqrt(
                (centroid_x - last_pos[0])**2 + 
                (centroid_y - last_pos[1])**2
            )
            
            if distance < min_distance:
                min_distance = distance
                best_match = track_id
        
        if best_match is not None:
            # Update existing track
            self.tracks[best_match]['last_position'] = [centroid_x, centroid_y]
            self.tracks[best_match]['last_time'] = datetime.now()
            return best_match
        else:
            # Create new track
            self.track_id += 1
            self.tracks[self.track_id] = {
                'last_position': [centroid_x, centroid_y],
                'last_time': datetime.now()
            }
            return self.track_id
    
    def _classify_vehicle(self, width: int, height: int) -> str:
        """Classify vehicle type based on dimensions"""
        aspect_ratio = width / height if height > 0 else 1
        
        if aspect_ratio > 2.5:
            return "truck"
        elif aspect_ratio > 1.8:
            return "sedan"
        elif aspect_ratio > 1.3:
            return "suv"
        elif aspect_ratio > 1.0:
            return "hatchback"
        else:
            return "motorcycle"
    
    def _read_plate(self, roi: np.ndarray) -> str:
        """Read license plate from ROI using Tesseract OCR"""
        try:
            if roi is None or roi.size == 0:
                return "UNKNOWN"
            
            # Preprocess the image for better OCR
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            
            # Increase contrast
            gray = cv2.equalizeHist(gray)
            
            # Resize for better detection
            gray = cv2.resize(gray, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
            
            # Apply Gaussian blur to reduce noise
            gray = cv2.GaussianBlur(gray, (3, 3), 0)
            
            # Apply threshold
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Try different configurations
            configs = [
                '--psm 8',  # Single word
                '--psm 7',  # Single line
                '--psm 6',  # Uniform block
                '--psm 13'  # Raw line
            ]
            
            for config in configs:
                text = pytesseract.image_to_string(thresh, config=config)
                text = text.strip().upper()
                
                # Clean the text
                text = re.sub(r'[^A-Z0-9-]', '', text)
                
                # Check if it looks like a plate (contains letters and numbers)
                if len(text) >= 4 and any(c.isalpha() for c in text) and any(c.isdigit() for c in text):
                    return text
            
            return "UNKNOWN"
        except Exception as e:
            print(f"Error reading plate: {e}")
            return "UNKNOWN"
    
    def _calculate_speed(self, current_centroid, track_id, current_time) -> float:
        """Calculate speed based on centroid movement"""
        if track_id in self.tracks:
            track = self.tracks[track_id]
            prev_centroid = track['last_position']
            prev_time = track['last_time']
            
            if prev_centroid and prev_time:
                distance = np.sqrt(
                    (current_centroid[0] - prev_centroid[0])**2 + 
                    (current_centroid[1] - prev_centroid[1])**2
                )
                
                time_diff = (datetime.now() - prev_time).total_seconds()
                
                if time_diff > 0:
                    # Simplified speed calculation (in pixels per second)
                    speed_pixels = distance / time_diff
                    
                    # Convert to km/h (approximate - needs calibration)
                    # Assuming ~100 pixels per meter
                    speed_ms = speed_pixels / 100
                    speed_kmh = speed_ms * 3.6
                    
                    return speed_kmh
        
        return 0
    
    def process_image(self, image_path: str) -> Dict[str, Any]:
        """Process a single image for vehicle detection"""
        
        image = cv2.imread(image_path)
        if image is None:
            return {"error": "Could not read image"}
        
        # Detect vehicles using YOLO
        vehicles = self._detect_vehicles_yolo(image)
        
        results = []
        for vehicle in vehicles:
            x, y, w, h = vehicle["bbox"]
            roi = image[y:y+h, x:x+w]
            plate = self._read_plate(roi)
            
            results.append({
                "bbox": [int(x), int(y), int(w), int(h)],
                "plate_number": plate,
                "confidence": vehicle["confidence"],
                "vehicle_type": vehicle["type"]
            })
        
        return {
            "vehicles": results,
            "total_detected": len(results)
        }