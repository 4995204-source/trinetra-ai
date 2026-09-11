import cv2
import time
from vehicle_detector import VehicleDetector

def test_vehicle_detection():
    print("=" * 60)
    print("🚗 Testing Vehicle Detection")
    print("=" * 60)
    
    detector = VehicleDetector()
    
    # Try laptop camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ No camera found")
        return
    
    print("🎥 Starting detection... Press 'q' to quit")
    print("📸 Showing detected vehicles and plates")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Process frame
        processed, vehicles, plates = detector.process_frame(frame)
        
        # Display
        cv2.imshow('TRINETRA AI - Vehicle Detection', processed)
        
        # Print detections
        if vehicles:
            print(f"🚗 {len(vehicles)} vehicles detected")
        
        if plates:
            for plate in plates:
                print(f"📸 Plate: {plate['plate']} ({plate['confidence']:.2f}%)")
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    test_vehicle_detection()