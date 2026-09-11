import cv2
from ultralytics import YOLO
import os

print("🚗 Testing YOLO on Video File")

# Check if video exists
video_path = "uploads/video_2.mp4"  # Change this to your video path

if not os.path.exists(video_path):
    print("❌ Video not found!")
    print("📁 Please upload a video first via Camera Network page")
    exit()

# Load model
model = YOLO('yolov8n.pt')
print("✅ Model loaded")

# Open video
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("❌ Could not open video")
    exit()

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"📹 Video: {total_frames} frames, {fps:.2f} FPS")

frame_count = 0
detections_found = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame_count += 1
    
    # Process every 30th frame
    if frame_count % 30 == 0:
        print(f"🔍 Processing frame {frame_count}/{total_frames}...")
        
        # Run YOLO
        results = model(frame, conf=0.1)
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    class_id = int(box.cls[0].item())
                    confidence = float(box.conf[0].item())
                    
                    # Check if vehicle class
                    vehicle_classes = {2: "Car", 3: "Motorcycle", 5: "Bus", 7: "Truck"}
                    
                    if class_id in vehicle_classes:
                        detections_found += 1
                        print(f"   ✅ Found: {vehicle_classes[class_id]} (Confidence: {confidence:.3f})")
                        
                        # Draw box
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, f"{vehicle_classes[class_id]} {confidence:.2f}", 
                                   (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

print(f"\n✅ Detection complete!")
print(f"📊 Processed {frame_count} frames")
print(f"🚗 Found {detections_found} vehicles in video")

cap.release()