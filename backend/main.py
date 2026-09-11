import os
import cv2
import time
import asyncio
import threading
import shutil
import uuid

from datetime import datetime
from typing import Optional

from fastapi import (
    FastAPI,
    Response,
    File,
    UploadFile,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from camera_manager import CameraManager
from vehicle_detector import VehicleDetector
from trajectory import TrajectoryTracker


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="TRINETRA AI",
    description="AI-powered intelligent traffic monitoring system",
    version="2.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# GLOBAL COMPONENTS
# =========================================================

camera_manager = CameraManager()
detector = VehicleDetector()
trajectory_tracker = TrajectoryTracker()


# =========================================================
# DIRECTORIES
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# =========================================================
# CONNECT AI TO CAMERA MANAGER
# =========================================================

camera_manager.set_detector(
    detector
)


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
async def startup_event():

    print()
    print("=" * 60)
    print("🚀 TRINETRA AI STARTING")
    print("=" * 60)

    # ---------------------------------------------------------
    # Laptop camera
    # ---------------------------------------------------------

    try:

        camera_manager.add_laptop_camera(
            0,
            "Laptop Camera",
            "Main System"
        )

    except Exception as e:

        print(
            f"⚠️ Laptop camera setup error: {e}"
        )

    # ---------------------------------------------------------
    # Phone camera
    # ---------------------------------------------------------

    try:

        camera_manager.add_phone_camera(
            "10.23.49.164",
            8080,
            "Phone Camera",
            "Main Gate",
            18.5204,
            73.8567
        )

    except Exception as e:

        print(
            f"⚠️ Phone camera setup error: {e}"
        )

    # ---------------------------------------------------------
    # Start camera system
    # ---------------------------------------------------------

    camera_manager.start_capture()

    print()
    print("🤖 AI detection pipeline connected")
    print("🚗 Vehicle detection: ENABLED")
    print("📹 Camera processing: ENABLED")
    print("🎬 Video processing: ENABLED")
    print("=" * 60)
    print()


# =========================================================
# SHUTDOWN
# =========================================================

@app.on_event("shutdown")
async def shutdown_event():

    print(
        "🛑 TRINETRA AI shutting down..."
    )

    camera_manager.stop()

    print(
        "✅ TRINETRA AI stopped"
    )


# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():

    return {
        "success": True,
        "name": "TRINETRA AI",
        "version": "2.0.0",
        "status": "running",
        "ai_detection": True
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health():

    return {
        "success": True,
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "cameras": len(
            camera_manager.cameras
        ),
        "detector_loaded": (
            detector.vehicle_model is not None
        )
    }


# =========================================================
# GET ALL CAMERAS
# =========================================================

@app.get("/api/cameras")
async def get_cameras():

    cameras = (
        camera_manager.get_all_cameras()
    )

    return {
        "success": True,
        "cameras": cameras,
        "count": len(cameras)
    }


# =========================================================
# GET SINGLE CAMERA
# =========================================================

@app.get("/api/camera/{cam_id}")
async def get_camera(
    cam_id: str
):

    camera = camera_manager.cameras.get(
        cam_id
    )

    if camera is None:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    cameras = (
        camera_manager.get_all_cameras()
    )

    for item in cameras:

        if item["id"] == cam_id:

            return {
                "success": True,
                "camera": item
            }

    raise HTTPException(
        status_code=404,
        detail="Camera not found"
    )


# =========================================================
# RAW FRAME
# =========================================================

@app.get("/api/camera/{cam_id}/raw")
async def get_raw_frame(
    cam_id: str
):

    frame = camera_manager.get_raw_frame(
        cam_id
    )

    if frame is None:

        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No frame available"
            }
        )

    try:

        success, encoded = cv2.imencode(
            ".jpg",
            frame,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                85
            ]
        )

        if not success:

            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Frame encoding failed"
                }
            )

        return Response(
            content=encoded.tobytes(),
            media_type="image/jpeg",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )

    except Exception as e:

        print(
            f"❌ Raw frame error: {e}"
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(e)
            }
        )


# =========================================================
# PROCESSED FRAME
# =========================================================

@app.get("/api/camera/{cam_id}/frame")
async def get_processed_frame(
    cam_id: str
):

    frame = camera_manager.get_frame(
        cam_id
    )

    if frame is None:

        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No frame available"
            }
        )

    try:

        success, encoded = cv2.imencode(
            ".jpg",
            frame,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                85
            ]
        )

        if not success:

            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Frame encoding failed"
                }
            )

        return Response(
            content=encoded.tobytes(),
            media_type="image/jpeg",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )

    except Exception as e:

        print(
            f"❌ Processed frame error: {e}"
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(e)
            }
        )


# =========================================================
# STREAM
# =========================================================

def generate_frames(
    cam_id: str
):

    while True:

        try:

            frame = camera_manager.get_frame(
                cam_id
            )

            if frame is None:

                time.sleep(
                    0.05
                )

                continue

            success, encoded = cv2.imencode(
                ".jpg",
                frame,
                [
                    cv2.IMWRITE_JPEG_QUALITY,
                    80
                ]
            )

            if not success:

                time.sleep(
                    0.05
                )

                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + encoded.tobytes()
                + b"\r\n"
            )

            time.sleep(
                0.03
            )

        except Exception as e:

            print(
                f"❌ Stream error for "
                f"{cam_id}: {e}"
            )

            break


@app.get("/api/camera/{cam_id}/stream")
async def camera_stream(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    from fastapi.responses import StreamingResponse

    return StreamingResponse(
        generate_frames(cam_id),
        media_type=(
            "multipart/x-mixed-replace; "
            "boundary=frame"
        ),
        headers={
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        }
    )


# =========================================================
# GET LATEST DETECTIONS
# =========================================================

@app.get("/api/camera/{cam_id}/detections")
async def get_detections(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    detections = (
        camera_manager.get_detections(
            cam_id
        )
    )

    vehicle_count = (
        camera_manager.get_vehicle_count(
            cam_id
        )
    )

    return {
        "success": True,
        "camera_id": cam_id,
        "vehicle_count": vehicle_count,
        "vehicles_detected": vehicle_count,
        "detections": detections,
        "timestamp": datetime.now().isoformat()
    }


# =========================================================
# DETECTION ENDPOINT
# =========================================================

@app.get("/api/camera/{cam_id}/detect")
async def detect_vehicles(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    # ---------------------------------------------------------
    # Use latest raw frame
    # ---------------------------------------------------------

    frame = camera_manager.get_raw_frame(
        cam_id
    )

    if frame is None:

        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No frame available"
            }
        )

    try:

        # -----------------------------------------------------
        # Run YOLO manually
        # -----------------------------------------------------

        processed_frame, vehicles = (
            detector.process_detection_only(
                frame
            )
        )

        # -----------------------------------------------------
        # Save result
        # -----------------------------------------------------

        camera = camera_manager.cameras[
            cam_id
        ]

        camera[
            "processed_frame"
        ] = processed_frame

        camera[
            "detections"
        ] = vehicles

        camera[
            "vehicle_count"
        ] = len(vehicles)

        camera[
            "last_detection_time"
        ] = time.time()

        camera[
            "last_processed_source_time"
        ] = camera.get(
            "last_frame_time",
            time.time()
        )

        return {
            "success": True,
            "camera_id": cam_id,
            "vehicles_detected": len(
                vehicles
            ),
            "total_vehicles": len(
                vehicles
            ),
            "detections": vehicles,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:

        print(
            f"❌ Detection endpoint error: "
            f"{e}"
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(e)
            }
        )


# =========================================================
# ADD PHONE CAMERA
# =========================================================

@app.post("/api/camera/add_phone")
async def add_phone_camera(
    ip: str,
    port: int = 8080,
    name: str = "Phone Camera",
    location: str = "Remote",
    latitude: float = 0,
    longitude: float = 0
):

    result = camera_manager.add_phone_camera(
        ip,
        port,
        name,
        location,
        latitude,
        longitude
    )

    if not result:

        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Failed to add phone camera"
            }
        )

    return {
        "success": True,
        "message": "Phone camera added",
        "cameras": camera_manager.get_all_cameras()
    }


# =========================================================
# UPLOAD VIDEO
# =========================================================

@app.post("/api/camera/upload_video")
async def upload_video(
    file: UploadFile = File(...)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )

    allowed_extensions = {
        ".mp4",
        ".avi",
        ".mov",
        ".mkv",
        ".webm",
        ".m4v"
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported video format. "
                "Use MP4, AVI, MOV, MKV, WEBM or M4V."
            )
        )

    safe_name = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    video_path = os.path.join(
        UPLOAD_DIR,
        safe_name
    )

    try:

        # -----------------------------------------------------
        # Save uploaded file
        # -----------------------------------------------------

        with open(
            video_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        print(
            f"🎬 Video uploaded: "
            f"{video_path}"
        )

        # -----------------------------------------------------
        # Verify video
        # -----------------------------------------------------

        test_cap = cv2.VideoCapture(
            video_path
        )

        if not test_cap.isOpened():

            test_cap.release()

            try:
                os.remove(
                    video_path
                )
            except:
                pass

            raise HTTPException(
                status_code=400,
                detail=(
                    "Uploaded video could not "
                    "be opened by OpenCV."
                )
            )

        fps = test_cap.get(
            cv2.CAP_PROP_FPS
        )

        total_frames = int(
            test_cap.get(
                cv2.CAP_PROP_FRAME_COUNT
            )
        )

        width = int(
            test_cap.get(
                cv2.CAP_PROP_FRAME_WIDTH
            )
        )

        height = int(
            test_cap.get(
                cv2.CAP_PROP_FRAME_HEIGHT
            )
        )

        test_cap.release()

        if fps <= 0:

            fps = 30.0

        print(
            f"🎬 Video verified: "
            f"{width}x{height}, "
            f"{fps:.2f} FPS, "
            f"{total_frames} frames"
        )

        # -----------------------------------------------------
        # Add as video camera
        # -----------------------------------------------------

        result = camera_manager.add_video_camera(
            video_path,
            file.filename,
            "Uploaded Video"
        )

        if not result:

            try:
                os.remove(
                    video_path
                )
            except:
                pass

            raise HTTPException(
                status_code=500,
                detail="Failed to create video camera"
            )

        # -----------------------------------------------------
        # Find created camera
        # -----------------------------------------------------

        video_camera_id = None

        for cam_id, camera in (
            camera_manager.cameras.items()
        ):

            if camera.get(
                "video_path"
            ) == video_path:

                video_camera_id = cam_id

                break

        return {
            "success": True,
            "message": "Video uploaded successfully",
            "camera_id": video_camera_id,
            "filename": file.filename,
            "video": {
                "width": width,
                "height": height,
                "fps": fps,
                "total_frames": total_frames
            },
            "camera": next(
                (
                    camera
                    for camera in camera_manager.get_all_cameras()
                    if camera["id"] == video_camera_id
                ),
                None
            )
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"❌ Video upload error: {e}"
        )

        try:

            if os.path.exists(
                video_path
            ):

                os.remove(
                    video_path
                )

        except:
            pass

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        try:
            await file.close()
        except:
            pass


# =========================================================
# STOP CAMERA
# =========================================================

@app.post("/api/camera/{cam_id}/stop")
async def stop_camera(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    result = camera_manager.stop_camera(
        cam_id
    )

    return {
        "success": result,
        "camera_id": cam_id,
        "message": (
            "Camera stopped"
            if result
            else "Failed to stop camera"
        )
    }


# =========================================================
# START CAMERA
# =========================================================

@app.post("/api/camera/{cam_id}/start")
async def start_camera(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    result = camera_manager.start_camera(
        cam_id
    )

    return {
        "success": result,
        "camera_id": cam_id,
        "message": (
            "Camera started"
            if result
            else "Failed to start camera"
        )
    }


# =========================================================
# REMOVE CAMERA
# =========================================================

@app.delete("/api/camera/{cam_id}")
async def remove_camera(
    cam_id: str
):

    if cam_id not in camera_manager.cameras:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    result = camera_manager.remove_camera(
        cam_id
    )

    return {
        "success": result,
        "camera_id": cam_id,
        "message": (
            "Camera removed"
            if result
            else "Failed to remove camera"
        )
    }


# =========================================================
# WATCHLIST
# =========================================================

@app.get("/api/watchlist")
async def get_watchlist():

    return {
        "success": True,
        "watchlist": detector.watchlist
    }


@app.post("/api/watchlist")
async def add_watchlist(
    plate: str,
    reason: str = "Suspicious"
):

    result = detector.add_to_watchlist(
        plate,
        reason
    )

    return {
        "success": result,
        "plate": plate.upper(),
        "reason": reason,
        "message": (
            "Plate added to watchlist"
            if result
            else "Plate already exists"
        )
    }


@app.delete("/api/watchlist/{plate}")
async def remove_watchlist(
    plate: str
):

    result = detector.remove_from_watchlist(
        plate
    )

    return {
        "success": result,
        "plate": plate.upper(),
        "message": (
            "Plate removed from watchlist"
            if result
            else "Plate not found"
        )
    }


# =========================================================
# PLATE SEARCH
# =========================================================

@app.get("/api/plates/search")
async def search_plate(
    plate: str
):

    results = detector.search_plate(
        plate
    )

    return {
        "success": True,
        "query": plate.upper(),
        "results": results,
        "count": len(results)
    }


# =========================================================
# DETECTION HISTORY
# =========================================================

@app.get("/api/detections/history")
async def detection_history():

    return {
        "success": True,
        "detections": detector.detection_history,
        "count": len(
            detector.detection_history
        )
    }


# =========================================================
# SYSTEM STATUS
# =========================================================

@app.get("/api/status")
async def system_status():

    cameras = (
        camera_manager.get_all_cameras()
    )

    online_cameras = [
        camera
        for camera in cameras
        if camera["status"] == "online"
    ]

    total_vehicles = sum(
        camera.get(
            "vehicle_count",
            0
        )
        for camera in cameras
    )

    return {
        "success": True,
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "ai": {
            "detector_loaded": (
                detector.vehicle_model
                is not None
            ),
            "ocr_loaded": (
                detector.reader
                is not None
            )
        },
        "cameras": {
            "total": len(cameras),
            "online": len(
                online_cameras
            )
        },
        "vehicles": {
            "currently_detected": total_vehicles
        },
        "watchlist": {
            "total": len(
                detector.watchlist
            )
        }
    }


# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )