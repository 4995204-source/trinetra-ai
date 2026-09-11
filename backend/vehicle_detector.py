import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import torch
from datetime import datetime
import re
import os
import threading
import time


class VehicleDetector:

    def __init__(self):

        print("🚗 Loading TRINETRA AI Detection Models...")

        # =====================================================
        # DEVICE
        # =====================================================

        self.use_gpu = torch.cuda.is_available()
        self.device = "cuda:0" if self.use_gpu else "cpu"

        if self.use_gpu:
            try:
                gpu_name = torch.cuda.get_device_name(0)

                print("==========================================")
                print("🚀 GPU ACCELERATION ENABLED")
                print(f"GPU: {gpu_name}")
                print(f"CUDA: {torch.version.cuda}")
                print(f"Device: {self.device}")
                print("==========================================")

            except Exception as e:
                print(f"⚠️ GPU detected but information failed: {e}")
                self.use_gpu = False
                self.device = "cpu"

        else:
            print("⚠️ CUDA not available - using CPU")

        # =====================================================
        # THREAD LOCKS
        # =====================================================

        self.model_lock = threading.Lock()
        self.ocr_lock = threading.Lock()
        self.cache_lock = threading.Lock()

        # =====================================================
        # YOLO VEHICLE MODEL
        # =====================================================

        try:

            model_path = os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                "yolov8n.pt"
            )

            self.vehicle_model = YOLO(model_path)

            # Explicitly move model to GPU
            self.vehicle_model.to(self.device)

            print("✅ YOLOv8n vehicle model loaded")
            print(f"🚀 YOLO device: {self.device}")

        except Exception as e:

            print(f"❌ YOLO loading error: {e}")

            self.vehicle_model = None

        # =====================================================
        # EASY OCR
        # =====================================================

        try:

            self.reader = easyocr.Reader(
                ["en"],
                gpu=self.use_gpu
            )

            if self.use_gpu:
                print("🚀 EasyOCR GPU acceleration enabled")
            else:
                print("⚠️ EasyOCR running on CPU")

            print("✅ EasyOCR loaded")

        except Exception as e:

            print(f"❌ EasyOCR loading error: {e}")

            self.reader = None

        # =====================================================
        # COCO VEHICLE CLASSES
        # =====================================================

        self.vehicle_classes = {
            2: "Car",
            3: "Motorcycle",
            5: "Bus",
            7: "Truck"
        }

        # =====================================================
        # HISTORY / WATCHLIST
        # =====================================================

        self.detection_history = []
        self.watchlist = []

        # =====================================================
        # PLATE STORAGE DUPLICATE CONTROL
        # =====================================================

        self.recent_plates = {}

        # =====================================================
        # OCR CACHE
        #
        # Prevent OCR from running for the same vehicle
        # on every frame.
        # =====================================================

        self.plate_cache = []

        # OCR will be refreshed after this amount of time.
        self.ocr_interval = 1.5

        # Minimum IoU required to consider two vehicle boxes
        # the same vehicle for OCR caching.
        self.cache_iou_threshold = 0.40

        # =====================================================
        # PERFORMANCE SETTINGS
        # =====================================================

        self.yolo_confidence = 0.25
        self.yolo_iou = 0.45
        self.yolo_imgsz = 640

        print("==========================================")
        print("🚗 TRINETRA AI Vehicle + ANPR Ready")
        print(f"⚡ Processing Device: {self.device}")
        print(f"🎯 YOLO Confidence: {self.yolo_confidence}")
        print(f"🧠 OCR Cache Interval: {self.ocr_interval}s")
        print("==========================================")

    # =========================================================
    # IOU
    # =========================================================

    def _calculate_iou(self, box_a, box_b):

        try:

            ax1, ay1, ax2, ay2 = box_a
            bx1, by1, bx2, by2 = box_b

            inter_x1 = max(ax1, bx1)
            inter_y1 = max(ay1, by1)

            inter_x2 = min(ax2, bx2)
            inter_y2 = min(ay2, by2)

            inter_width = max(0, inter_x2 - inter_x1)
            inter_height = max(0, inter_y2 - inter_y1)

            intersection = inter_width * inter_height

            area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
            area_b = max(0, bx2 - bx1) * max(0, by2 - by1)

            union = area_a + area_b - intersection

            if union <= 0:
                return 0.0

            return intersection / union

        except Exception:
            return 0.0

    # =========================================================
    # FIND CACHED PLATE
    # =========================================================

    def _find_cached_plate(self, vehicle):

        current_box = vehicle.get("bbox")

        if not current_box:
            return None

        current_time = time.time()

        with self.cache_lock:

            for item in self.plate_cache:

                if item["class_id"] != vehicle["class_id"]:
                    continue

                iou = self._calculate_iou(
                    current_box,
                    item["bbox"]
                )

                if iou >= self.cache_iou_threshold:

                    age = current_time - item["timestamp"]

                    if age < self.ocr_interval:

                        return {
                            "plate": item["plate"],
                            "confidence": item["confidence"],
                            "plate_bbox": item["plate_bbox"]
                        }

        return None

    # =========================================================
    # SAVE OCR RESULT TO CACHE
    # =========================================================

    def _update_plate_cache(
        self,
        vehicle,
        plate_text,
        confidence,
        plate_bbox
    ):

        current_box = vehicle.get("bbox")

        if not current_box:
            return

        current_time = time.time()

        with self.cache_lock:

            best_index = None
            best_iou = 0

            for index, item in enumerate(self.plate_cache):

                if item["class_id"] != vehicle["class_id"]:
                    continue

                iou = self._calculate_iou(
                    current_box,
                    item["bbox"]
                )

                if iou > best_iou:

                    best_iou = iou
                    best_index = index

            cache_item = {
                "bbox": current_box.copy(),
                "class_id": vehicle["class_id"],
                "plate": plate_text,
                "confidence": confidence,
                "plate_bbox": plate_bbox,
                "timestamp": current_time
            }

            if (
                best_index is not None
                and best_iou >= self.cache_iou_threshold
            ):

                self.plate_cache[best_index] = cache_item

            else:

                self.plate_cache.append(cache_item)

            # Keep cache small
            if len(self.plate_cache) > 100:

                self.plate_cache = self.plate_cache[-100:]

    # =========================================================
    # VEHICLE DETECTION
    # =========================================================

    def detect_vehicles(self, frame):

        if frame is None:

            print("❌ YOLO received empty frame")

            return frame, []

        if self.vehicle_model is None:

            print("❌ YOLO model is not loaded")

            return frame, []

        detections = []

        try:

            with self.model_lock:

                results = self.vehicle_model.predict(
                    source=frame,
                    conf=self.yolo_confidence,
                    iou=self.yolo_iou,
                    imgsz=self.yolo_imgsz,
                    classes=[2, 3, 5, 7],
                    device=self.device,
                    half=self.use_gpu,
                    verbose=False
                )

            for result in results:

                if result.boxes is None:
                    continue

                for box in result.boxes:

                    class_id = int(
                        box.cls[0].item()
                    )

                    confidence = float(
                        box.conf[0].item()
                    )

                    if class_id not in self.vehicle_classes:
                        continue

                    x1, y1, x2, y2 = map(
                        int,
                        box.xyxy[0].tolist()
                    )

                    h, w = frame.shape[:2]

                    x1 = max(
                        0,
                        min(x1, w - 1)
                    )

                    y1 = max(
                        0,
                        min(y1, h - 1)
                    )

                    x2 = max(
                        0,
                        min(x2, w - 1)
                    )

                    y2 = max(
                        0,
                        min(y2, h - 1)
                    )

                    if x2 <= x1 or y2 <= y1:
                        continue

                    vehicle_name = self.vehicle_classes[
                        class_id
                    ]

                    detection = {

                        "class": vehicle_name,

                        "class_id": class_id,

                        "confidence": round(
                            confidence,
                            3
                        ),

                        "bbox": [
                            x1,
                            y1,
                            x2,
                            y2
                        ],

                        "center": [
                            (x1 + x2) // 2,
                            (y1 + y2) // 2
                        ],

                        "plate": None,

                        "plate_confidence": 0,

                        "plate_bbox": None
                    }

                    detections.append(
                        detection
                    )

                    # =================================================
                    # VEHICLE BOX
                    # =================================================

                    cv2.rectangle(
                        frame,
                        (x1, y1),
                        (x2, y2),
                        (0, 255, 0),
                        2
                    )

                    # =================================================
                    # VEHICLE LABEL
                    # =================================================

                    cv2.putText(
                        frame,
                        f"{vehicle_name} {confidence:.2f}",
                        (
                            x1,
                            max(25, y1 - 10)
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (0, 255, 0),
                        2
                    )

            return frame, detections

        except Exception as e:

            print(
                f"❌ YOLO detection error: {e}"
            )

            import traceback

            traceback.print_exc()

            return frame, []

    # =========================================================
    # IMAGE PREPROCESSING FOR PLATE OCR
    # =========================================================

    def _prepare_ocr_images(self, image):

        if (
            image is None
            or image.size == 0
        ):
            return []

        images = []

        try:

            gray = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )

            # =================================================
            # UPSCALE
            # =================================================

            enlarged = cv2.resize(
                gray,
                None,
                fx=2.0,
                fy=2.0,
                interpolation=cv2.INTER_CUBIC
            )

            images.append(enlarged)

            # =================================================
            # CLAHE
            # =================================================

            clahe = cv2.createCLAHE(
                clipLimit=2.0,
                tileGridSize=(8, 8)
            )

            enhanced = clahe.apply(
                enlarged
            )

            images.append(enhanced)

            # =================================================
            # ADAPTIVE THRESHOLD
            # =================================================

            adaptive = cv2.adaptiveThreshold(
                enhanced,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11,
                2
            )

            images.append(adaptive)

        except Exception as e:

            print(
                f"⚠️ OCR preprocessing error: {e}"
            )

        return images

    # =========================================================
    # CLEAN PLATE TEXT
    # =========================================================

    def _clean_plate_text(self, text):

        if not text:
            return None

        text = text.upper().strip()

        replacements = {

            " ": "",
            "-": "",
            "_": "",
            ".": "",
            ":": "",
            "/": "",
            "\\": "",
            "|": "",
            "(": "",
            ")": "",
            "[": "",
            "]": "",
            "{": "",
            "}": ""
        }

        for old, new in replacements.items():

            text = text.replace(
                old,
                new
            )

        cleaned = re.sub(
            r"[^A-Z0-9]",
            "",
            text
        )

        if len(cleaned) < 6:
            return None

        if len(cleaned) > 12:
            return None

        has_letter = any(
            char.isalpha()
            for char in cleaned
        )

        has_digit = any(
            char.isdigit()
            for char in cleaned
        )

        if not has_letter or not has_digit:
            return None

        return cleaned

    # =========================================================
    # PLATE REGION CANDIDATE DETECTION
    # =========================================================

    def _find_plate_candidates(
        self,
        vehicle_roi
    ):

        candidates = []

        if (
            vehicle_roi is None
            or vehicle_roi.size == 0
        ):
            return candidates

        try:

            gray = cv2.cvtColor(
                vehicle_roi,
                cv2.COLOR_BGR2GRAY
            )

            blurred = cv2.GaussianBlur(
                gray,
                (5, 5),
                0
            )

            edges = cv2.Canny(
                blurred,
                50,
                150
            )

            contours, _ = cv2.findContours(
                edges,
                cv2.RETR_LIST,
                cv2.CHAIN_APPROX_SIMPLE
            )

            height, width = gray.shape[:2]

            vehicle_area = width * height

            for contour in contours:

                x, y, w, h = cv2.boundingRect(
                    contour
                )

                if w <= 0 or h <= 0:
                    continue

                area = w * h

                if area < vehicle_area * 0.005:
                    continue

                if area > vehicle_area * 0.50:
                    continue

                aspect_ratio = w / float(h)

                if aspect_ratio < 1.8:
                    continue

                if aspect_ratio > 7.0:
                    continue

                relative_width = w / float(width)

                if relative_width < 0.15:
                    continue

                if relative_width > 0.95:
                    continue

                crop = vehicle_roi[
                    y:y + h,
                    x:x + w
                ]

                if crop.size == 0:
                    continue

                candidates.append({

                    "image": crop,

                    "bbox": [
                        x,
                        y,
                        x + w,
                        y + h
                    ],

                    "area": area,

                    "aspect_ratio": aspect_ratio
                })

            candidates.sort(
                key=lambda item: (
                    item["area"],
                    item["aspect_ratio"]
                ),
                reverse=True
            )

            # IMPORTANT:
            # Reduced from 10 candidates to 5
            # to reduce OCR workload.

            return candidates[:5]

        except Exception as e:

            print(
                f"⚠️ Plate candidate error: {e}"
            )

            return []

    # =========================================================
    # OCR ON IMAGE
    # =========================================================

    def _read_plate_from_image(
        self,
        image
    ):

        if (
            self.reader is None
            or image is None
            or image.size == 0
        ):

            return None, 0, None

        best_text = None
        best_confidence = 0
        best_bbox = None

        try:

            ocr_images = (
                self._prepare_ocr_images(
                    image
                )
            )

            for ocr_image in ocr_images:

                try:

                    with self.ocr_lock:

                        results = self.reader.readtext(
                            ocr_image,
                            allowlist=(
                                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                "0123456789"
                            ),
                            paragraph=False,
                            detail=1,
                            width_ths=0.5,
                            height_ths=0.5
                        )

                except Exception as e:

                    print(
                        f"⚠️ OCR pass failed: {e}"
                    )

                    continue

                for result in results:

                    if len(result) != 3:
                        continue

                    bbox, text, confidence = result

                    cleaned = (
                        self._clean_plate_text(
                            text
                        )
                    )

                    if cleaned is None:
                        continue

                    confidence = float(
                        confidence
                    )

                    if confidence < 0.30:
                        continue

                    if confidence > best_confidence:

                        best_text = cleaned

                        best_confidence = confidence

                        best_bbox = bbox

            return (
                best_text,
                best_confidence,
                best_bbox
            )

        except Exception as e:

            print(
                f"⚠️ Plate OCR error: {e}"
            )

            return None, 0, None

    # =========================================================
    # NUMBER PLATE DETECTION + OCR
    # =========================================================

    def detect_plate(
        self,
        frame,
        vehicle_bbox
    ):

        if (
            frame is None
            or self.reader is None
        ):

            return None, 0, None

        try:

            x1, y1, x2, y2 = vehicle_bbox

            h, w = frame.shape[:2]

            x1 = max(
                0,
                min(x1, w - 1)
            )

            y1 = max(
                0,
                min(y1, h - 1)
            )

            x2 = max(
                0,
                min(x2, w)
            )

            y2 = max(
                0,
                min(y2, h)
            )

            if x2 <= x1 or y2 <= y1:

                return None, 0, None

            vehicle_roi = frame[
                y1:y2,
                x1:x2
            ]

            if vehicle_roi.size == 0:

                return None, 0, None

            # =================================================
            # BEST RESULT
            # =================================================

            best_text = None

            best_confidence = 0

            best_bbox = None

            # =================================================
            # METHOD 1
            # OCR ON VEHICLE
            #
            # This is retained because it can work when
            # the plate-region contour is not detected.
            # =================================================

            text, confidence, ocr_bbox = (
                self._read_plate_from_image(
                    vehicle_roi
                )
            )

            if text is not None:

                best_text = text

                best_confidence = confidence

                best_bbox = ocr_bbox

            # =================================================
            # METHOD 2
            # PLATE-SHAPED REGIONS
            # =================================================

            candidates = (
                self._find_plate_candidates(
                    vehicle_roi
                )
            )

            for candidate in candidates:

                text, confidence, _ = (
                    self._read_plate_from_image(
                        candidate["image"]
                    )
                )

                if text is None:
                    continue

                adjusted_confidence = min(
                    1.0,
                    confidence + 0.03
                )

                if adjusted_confidence > best_confidence:

                    best_text = text

                    best_confidence = (
                        adjusted_confidence
                    )

                    cx1, cy1, cx2, cy2 = (
                        candidate["bbox"]
                    )

                    best_bbox = [

                        [
                            cx1,
                            cy1
                        ],

                        [
                            cx2,
                            cy1
                        ],

                        [
                            cx2,
                            cy2
                        ],

                        [
                            cx1,
                            cy2
                        ]
                    ]

            if best_text is None:

                return None, 0, None

            # =================================================
            # CONVERT BBOX TO ORIGINAL FRAME
            # =================================================

            plate_bbox = None

            if (
                isinstance(best_bbox, list)
                and len(best_bbox) >= 4
            ):

                try:

                    xs = [
                        int(point[0])
                        for point in best_bbox
                    ]

                    ys = [
                        int(point[1])
                        for point in best_bbox
                    ]

                    px1 = min(xs)
                    py1 = min(ys)

                    px2 = max(xs)
                    py2 = max(ys)

                    # OCR images are 2x enlarged.

                    px1 = int(px1 / 2)
                    py1 = int(py1 / 2)

                    px2 = int(px2 / 2)
                    py2 = int(py2 / 2)

                    plate_bbox = [

                        max(
                            0,
                            x1 + px1
                        ),

                        max(
                            0,
                            y1 + py1
                        ),

                        min(
                            w - 1,
                            x1 + px2
                        ),

                        min(
                            h - 1,
                            y1 + py2
                        )
                    ]

                except Exception:

                    plate_bbox = None

            print(
                f"📋 Plate: "
                f"{best_text} "
                f"({best_confidence:.2f})"
            )

            return (
                best_text,
                best_confidence,
                plate_bbox
            )

        except Exception as e:

            print(
                f"⚠️ Plate detection error: {e}"
            )

            return None, 0, None

    # =========================================================
    # PROCESS PLATE WITH CACHE
    # =========================================================

    def _process_vehicle_plate(
        self,
        frame,
        vehicle
    ):

        # =================================================
        # CHECK CACHE FIRST
        # =================================================

        cached = self._find_cached_plate(
            vehicle
        )

        if cached is not None:

            vehicle["plate"] = cached["plate"]

            vehicle["plate_confidence"] = round(
                cached["confidence"],
                3
            )

            vehicle["plate_bbox"] = (
                cached["plate_bbox"]
            )

            return (
                cached["plate"],
                cached["confidence"],
                cached["plate_bbox"]
            )

        # =================================================
        # RUN OCR
        # =================================================

        plate_text, confidence, plate_bbox = (
            self.detect_plate(
                frame,
                vehicle["bbox"]
            )
        )

        # =================================================
        # UPDATE CACHE
        # =================================================

        self._update_plate_cache(
            vehicle,
            plate_text,
            confidence,
            plate_bbox
        )

        vehicle["plate"] = plate_text

        vehicle["plate_confidence"] = round(
            confidence,
            3
        )

        vehicle["plate_bbox"] = plate_bbox

        return (
            plate_text,
            confidence,
            plate_bbox
        )

    # =========================================================
    # DRAW PLATE
    # =========================================================

    def _draw_plate(
        self,
        frame,
        plate_text,
        plate_confidence,
        plate_bbox,
        vehicle_bbox
    ):

        if frame is None:
            return

        h, w = frame.shape[:2]

        x1, y1, x2, y2 = vehicle_bbox

        # =====================================================
        # PLATE BOX
        # =====================================================

        if plate_bbox is not None:

            px1, py1, px2, py2 = plate_bbox

            cv2.rectangle(
                frame,
                (px1, py1),
                (px2, py2),
                (0, 0, 255),
                2
            )

            label_y = max(
                20,
                py1 - 8
            )

        else:

            label_y = min(
                h - 10,
                y2 + 25
            )

        # =====================================================
        # PLATE LABEL
        # =====================================================

        label = (
            f"Plate: {plate_text} "
            f"{plate_confidence:.2f}"
        )

        text_size = cv2.getTextSize(
            label,
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            2
        )[0]

        label_x = max(
            0,
            min(
                x1,
                w - text_size[0] - 5
            )
        )

        cv2.rectangle(
            frame,
            (
                label_x,
                max(
                    0,
                    label_y - 22
                )
            ),
            (
                label_x + text_size[0] + 6,
                label_y + 4
            ),
            (0, 0, 0),
            -1
        )

        cv2.putText(
            frame,
            label,
            (
                label_x + 3,
                label_y
            ),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 0, 255),
            2
        )

    # =========================================================
    # SAVE PLATE DETECTION
    # =========================================================

    def _save_plate_detection(
        self,
        plate_text,
        confidence,
        vehicle,
        camera_id
    ):

        if not plate_text:
            return

        now = datetime.now()

        previous_time = (
            self.recent_plates.get(
                plate_text,
                0
            )
        )

        current_timestamp = now.timestamp()

        if (
            current_timestamp
            - previous_time
            < 3
        ):

            return

        self.recent_plates[
            plate_text
        ] = current_timestamp

        plate_data = {

            "plate": plate_text,

            "confidence": round(
                confidence,
                3
            ),

            "vehicle": vehicle,

            "camera": camera_id,

            "timestamp": now.isoformat()
        }

        self.detection_history.append(
            plate_data
        )

        if len(self.detection_history) > 500:

            self.detection_history.pop(0)

        print(
            f"💾 PLATE SAVED: "
            f"{plate_text} | "
            f"{confidence:.2f} | "
            f"{camera_id}"
        )

    # =========================================================
    # PROCESS FRAME
    # =========================================================

    def process_frame(
        self,
        frame,
        camera_id="unknown"
    ):

        if frame is None:

            return None, [], []

        processed_frame = frame.copy()

        processed_frame, vehicles = (
            self.detect_vehicles(
                processed_frame
            )
        )

        plates = []

        for vehicle in vehicles:

            plate_text, confidence, plate_bbox = (
                self._process_vehicle_plate(
                    frame,
                    vehicle
                )
            )

            if not plate_text:
                continue

            plate_data = {

                "plate": plate_text,

                "confidence": round(
                    confidence,
                    3
                ),

                "vehicle": vehicle,

                "camera": camera_id,

                "timestamp": datetime.now().isoformat()
            }

            plates.append(
                plate_data
            )

            # =================================================
            # DRAW PLATE
            # =================================================

            self._draw_plate(
                processed_frame,
                plate_text,
                confidence,
                plate_bbox,
                vehicle["bbox"]
            )

            # =================================================
            # SAVE HISTORY
            # =================================================

            self._save_plate_detection(
                plate_text,
                confidence,
                vehicle,
                camera_id
            )

            # =================================================
            # WATCHLIST
            # =================================================

            if self.check_watchlist(
                plate_text
            ):

                x1, y1, x2, y2 = (
                    vehicle["bbox"]
                )

                cv2.putText(
                    processed_frame,
                    "WATCHLIST!",
                    (
                        x1,
                        min(
                            processed_frame.shape[0] - 10,
                            y2 + 55
                        )
                    ),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.75,
                    (0, 0, 255),
                    3
                )

        return (
            processed_frame,
            vehicles,
            plates
        )

    # =========================================================
    # LIVE PROCESSING
    # =========================================================

    def process_detection_only(
        self,
        frame,
        camera_id="unknown"
    ):

        if frame is None:

            return None, []

        processed_frame = frame.copy()

        processed_frame, vehicles = (
            self.detect_vehicles(
                processed_frame
            )
        )

        for vehicle in vehicles:

            plate_text, confidence, plate_bbox = (
                self._process_vehicle_plate(
                    frame,
                    vehicle
                )
            )

            if plate_text:

                # =================================================
                # DRAW PLATE
                # =================================================

                self._draw_plate(
                    processed_frame,
                    plate_text,
                    confidence,
                    plate_bbox,
                    vehicle["bbox"]
                )

                # =================================================
                # SAVE HISTORY
                # =================================================

                self._save_plate_detection(
                    plate_text,
                    confidence,
                    vehicle,
                    camera_id
                )

                # =================================================
                # WATCHLIST
                # =================================================

                if self.check_watchlist(
                    plate_text
                ):

                    x1, y1, x2, y2 = (
                        vehicle["bbox"]
                    )

                    cv2.putText(
                        processed_frame,
                        "WATCHLIST!",
                        (
                            x1,
                            min(
                                processed_frame.shape[0] - 10,
                                y2 + 55
                            )
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.75,
                        (0, 0, 255),
                        3
                    )

        return (
            processed_frame,
            vehicles
        )

    # =========================================================
    # SEARCH PLATE
    # =========================================================

    def search_plate(
        self,
        plate_number
    ):

        search = (
            plate_number
            .upper()
            .replace(" ", "")
            .replace("-", "")
        )

        return [
            detection
            for detection in self.detection_history
            if search in detection["plate"]
        ]

    # =========================================================
    # WATCHLIST
    # =========================================================

    def add_to_watchlist(
        self,
        plate_number,
        reason="Suspicious"
    ):

        plate_number = (
            plate_number
            .upper()
            .replace(" ", "")
            .replace("-", "")
        )

        if plate_number not in [
            w["plate"]
            for w in self.watchlist
        ]:

            self.watchlist.append({

                "plate": plate_number,

                "reason": reason,

                "added_at": datetime.now().isoformat(),

                "status": "active"
            })

            print(
                f"🚨 Watchlist added: "
                f"{plate_number}"
            )

            return True

        return False

    # =========================================================
    # CHECK WATCHLIST
    # =========================================================

    def check_watchlist(
        self,
        plate_number
    ):

        if not plate_number:
            return False

        plate_number = (
            plate_number
            .upper()
            .replace(" ", "")
            .replace("-", "")
        )

        for item in self.watchlist:

            if (
                item["plate"] == plate_number
                and item["status"] == "active"
            ):

                return True

        return False

    # =========================================================
    # REMOVE FROM WATCHLIST
    # =========================================================

    def remove_from_watchlist(
        self,
        plate_number
    ):

        plate_number = (
            plate_number
            .upper()
            .replace(" ", "")
            .replace("-", "")
        )

        for item in self.watchlist:

            if item["plate"] == plate_number:

                item["status"] = "inactive"

                print(
                    f"🚨 Watchlist removed: "
                    f"{plate_number}"
                )

                return True

        return False