import cv2
import numpy as np
import requests
import queue
import threading
import time
import os


class CameraManager:

    def __init__(self):

        self.cameras = {}
        self.camera_queues = {}

        self.running = False

        self.threads = {}
        self.stop_events = {}

        # AI processing
        self.detector = None
        self.ai_thread = None
        self.ai_stop_event = threading.Event()

        # Protect shared camera data
        self.data_lock = threading.RLock()

        print("📷 Camera Manager Ready")

    # =========================================================
    # CONNECT AI DETECTOR
    # =========================================================

    def set_detector(self, detector):

        self.detector = detector

        print("🤖 AI detector connected to Camera Manager")

        if self.running:
            self.start_ai_processing()

    # =========================================================
    # START AI PROCESSING
    # =========================================================

    def start_ai_processing(self):

        if self.detector is None:
            print(
                "⚠️ AI processing not started: "
                "detector is not connected"
            )
            return False

        if (
            self.ai_thread is not None
            and self.ai_thread.is_alive()
        ):
            return True

        self.ai_stop_event.clear()

        self.ai_thread = threading.Thread(
            target=self._ai_processing_loop,
            daemon=True,
            name="TRINETRA-AI"
        )

        self.ai_thread.start()

        print("🤖 Continuous AI processing started")

        return True

    # =========================================================
    # AI PROCESSING LOOP
    # =========================================================

    def _ai_processing_loop(self):

        print("🤖 AI worker thread running")

        while (
            self.running
            and not self.ai_stop_event.is_set()
        ):

            try:

                if self.detector is None:
                    self.ai_stop_event.wait(0.2)
                    continue

                camera_ids = list(
                    self.cameras.keys()
                )

                processed_any = False

                for cam_id in camera_ids:

                    if (
                        not self.running
                        or self.ai_stop_event.is_set()
                    ):
                        break

                    try:

                        with self.data_lock:

                            camera = self.cameras.get(
                                cam_id
                            )

                            if camera is None:
                                continue

                            raw_frame = camera.get(
                                "last_frame"
                            )

                            source_time = camera.get(
                                "last_frame_time",
                                0
                            )

                            last_processed_time = (
                                camera.get(
                                    "last_processed_source_time",
                                    0
                                )
                            )

                            if raw_frame is None:
                                continue

                            if source_time <= last_processed_time:
                                continue

                            frame_copy = raw_frame.copy()

                    except Exception as e:

                        print(
                            f"⚠️ AI frame copy error "
                            f"for {cam_id}: {e}"
                        )

                        continue

                    # =================================================
                    # RUN YOLO
                    # =================================================

                    try:

                        processed_frame, detections = (
                            self.detector.process_detection_only(
                                frame_copy
                            )
                        )

                    except Exception as e:

                        print(
                            f"❌ AI detection error "
                            f"for {cam_id}: {e}"
                        )

                        continue

                    if processed_frame is None:
                        continue

                    # =================================================
                    # STORE AI RESULT
                    # =================================================

                    with self.data_lock:

                        camera = self.cameras.get(
                            cam_id
                        )

                        if camera is None:
                            continue

                        camera[
                            "processed_frame"
                        ] = processed_frame

                        camera[
                            "detections"
                        ] = detections

                        camera[
                            "vehicle_count"
                        ] = len(detections)

                        camera[
                            "last_processed_source_time"
                        ] = source_time

                        camera[
                            "last_detection_time"
                        ] = time.time()

                    processed_any = True

                    if detections:

                        print(
                            f"🚗 {cam_id}: "
                            f"{len(detections)} vehicle(s) detected"
                        )

                # -----------------------------------------------------
                # Prevent unnecessary CPU usage when no frame changed
                # -----------------------------------------------------

                if not processed_any:

                    self.ai_stop_event.wait(
                        0.03
                    )

            except Exception as e:

                print(
                    f"❌ AI processing loop error: {e}"
                )

                self.ai_stop_event.wait(
                    0.1
                )

        print("🛑 AI worker thread stopped")

    # =========================================================
    # ADD LAPTOP / USB CAMERA
    # =========================================================

    def add_laptop_camera(
        self,
        camera_index=0,
        name="Laptop Camera",
        location="Main System"
    ):

        try:

            if "laptop" in self.cameras:

                print(
                    "⚠️ Laptop camera already exists"
                )

                return False

            cap = cv2.VideoCapture(
                camera_index,
                cv2.CAP_DSHOW
            )

            if not cap.isOpened():

                print(
                    "❌ Laptop camera could not be opened"
                )

                return False

            cap.set(
                cv2.CAP_PROP_FRAME_WIDTH,
                640
            )

            cap.set(
                cv2.CAP_PROP_FRAME_HEIGHT,
                480
            )

            self.cameras["laptop"] = {

                "source": cap,

                "type": "laptop",

                "status": "offline",

                # Raw frame
                "last_frame": None,

                "last_frame_time": 0,

                # Processed AI frame
                "processed_frame": None,

                "detections": [],

                "vehicle_count": 0,

                "last_processed_source_time": 0,

                "last_detection_time": 0,

                "name": name,

                "location": location,

                "camera_index": camera_index,

                "latitude": 0,

                "longitude": 0
            }

            self.camera_queues["laptop"] = queue.Queue(
                maxsize=10
            )

            self.stop_events["laptop"] = (
                threading.Event()
            )

            print(
                f"✅ Laptop Camera Added: {name}"
            )

            if self.running:

                self.start_camera(
                    "laptop"
                )

            return True

        except Exception as e:

            print(
                f"❌ Laptop camera error: {e}"
            )

            return False

    # =========================================================
    # ADD PHONE / IP CAMERA
    # =========================================================

    def add_phone_camera(
        self,
        ip,
        port=8080,
        name="Phone Camera",
        location="Remote",
        lat=0,
        lng=0
    ):

        try:

            if not ip:

                print(
                    "❌ IP address is required"
                )

                return False

            number = 1

            while (
                f"phone_{number}"
                in self.cameras
            ):

                number += 1

            camera_id = (
                f"phone_{number}"
            )

            video_url = (
                f"http://{ip}:{int(port)}/video"
            )

            self.cameras[camera_id] = {

                "source": video_url,

                "type": "phone",

                "status": "offline",

                # Raw frame
                "last_frame": None,

                "last_frame_time": 0,

                # AI frame
                "processed_frame": None,

                "detections": [],

                "vehicle_count": 0,

                "last_processed_source_time": 0,

                "last_detection_time": 0,

                "name": name,

                "location": location,

                "ip": ip,

                "port": int(port),

                "latitude": lat,

                "longitude": lng
            }

            self.camera_queues[camera_id] = (
                queue.Queue(maxsize=10)
            )

            self.stop_events[camera_id] = (
                threading.Event()
            )

            print(
                f"📱 {name} added as {camera_id}"
            )

            print(
                f"📱 URL: {video_url}"
            )

            print(
                f"📍 Location: "
                f"{location} ({lat}, {lng})"
            )

            if self.running:

                self.start_camera(
                    camera_id
                )

            return True

        except Exception as e:

            print(
                f"❌ Phone camera error: {e}"
            )

            return False

    # =========================================================
    # ADD VIDEO FILE CAMERA
    # =========================================================

    def add_video_camera(
        self,
        video_path,
        name="Video Camera",
        location="Virtual"
    ):

        try:

            if not os.path.exists(video_path):

                print(
                    f"❌ Video does not exist: "
                    f"{video_path}"
                )

                return False

            # -------------------------------------------------
            # Verify video
            # -------------------------------------------------

            test_cap = cv2.VideoCapture(
                video_path
            )

            if not test_cap.isOpened():

                print(
                    f"❌ OpenCV cannot open video: "
                    f"{video_path}"
                )

                test_cap.release()

                return False

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

            ret, first_frame = (
                test_cap.read()
            )

            test_cap.release()

            if (
                not ret
                or first_frame is None
            ):

                print(
                    "❌ Video opened but "
                    "first frame could not be read"
                )

                return False

            if fps <= 0:

                fps = 30.0

            print(
                "🎬 Video verified successfully"
            )

            print(
                f"   Resolution: "
                f"{width}x{height}"
            )

            print(
                f"   FPS: {fps:.2f}"
            )

            print(
                f"   Frames: {total_frames}"
            )

            # -------------------------------------------------
            # Generate unique ID
            # -------------------------------------------------

            number = 1

            while (
                f"video_{number}"
                in self.cameras
            ):

                number += 1

            camera_id = (
                f"video_{number}"
            )

            self.cameras[camera_id] = {

                "source": None,

                "type": "video",

                "status": "offline",

                # Raw frame
                "last_frame": None,

                "last_frame_time": 0,

                # AI frame
                "processed_frame": None,

                "detections": [],

                "vehicle_count": 0,

                "last_processed_source_time": 0,

                "last_detection_time": 0,

                "name": name,

                "location": location,

                "video_path": video_path,

                "fps": fps,

                "total_frames": total_frames,

                "current_frame": 0,

                "loop": True,

                "latitude": 0,

                "longitude": 0
            }

            self.camera_queues[camera_id] = (
                queue.Queue(maxsize=10)
            )

            self.stop_events[camera_id] = (
                threading.Event()
            )

            print(
                f"✅ Video Camera Added: "
                f"{camera_id}"
            )

            print(
                f"🎬 File: {video_path}"
            )

            if self.running:

                self.start_camera(
                    camera_id
                )

            return True

        except Exception as e:

            print(
                f"❌ Video camera error: {e}"
            )

            return False

    # =========================================================
    # START ALL CAMERAS
    # =========================================================

    def start_capture(self):

        self.running = True

        for cam_id in list(
            self.cameras.keys()
        ):

            self.start_camera(
                cam_id
            )

        # Start AI after camera capture
        self.start_ai_processing()

        print(
            "✅ Camera capture system running"
        )

    # =========================================================
    # START INDIVIDUAL CAMERA
    # =========================================================

    def start_camera(
        self,
        cam_id
    ):

        if cam_id not in self.cameras:

            print(
                f"❌ Camera not found: "
                f"{cam_id}"
            )

            return False

        self.running = True

        # Prevent duplicate threads
        if (
            cam_id in self.threads
            and self.threads[cam_id].is_alive()
        ):

            return True

        if cam_id not in self.stop_events:

            self.stop_events[
                cam_id
            ] = threading.Event()

        self.stop_events[
            cam_id
        ].clear()

        camera_type = self.cameras[
            cam_id
        ]["type"]

        if camera_type == "laptop":

            target = self._capture_laptop

        elif camera_type == "phone":

            target = self._capture_phone

        elif camera_type == "video":

            target = self._capture_video

        else:

            print(
                f"❌ Unknown camera type: "
                f"{camera_type}"
            )

            return False

        thread = threading.Thread(
            target=target,
            args=(cam_id,),
            daemon=True,
            name=f"TRINETRA-{cam_id}"
        )

        self.threads[
            cam_id
        ] = thread

        thread.start()

        print(
            f"▶️ {cam_id} thread started"
        )

        return True

    # =========================================================
    # LAPTOP CAPTURE
    # =========================================================

    def _capture_laptop(
        self,
        cam_id
    ):

        camera = self.cameras[
            cam_id
        ]

        cap = camera[
            "source"
        ]

        stop_event = self.stop_events[
            cam_id
        ]

        print(
            f"📸 {cam_id}: capture started"
        )

        while (
            self.running
            and not stop_event.is_set()
        ):

            try:

                ret, frame = cap.read()

                if not ret:

                    camera[
                        "status"
                    ] = "offline"

                    time.sleep(
                        0.1
                    )

                    continue

                frame = cv2.resize(
                    frame,
                    (640, 480)
                )

                timestamp = time.time()

                with self.data_lock:

                    camera[
                        "last_frame"
                    ] = frame

                    camera[
                        "last_frame_time"
                    ] = timestamp

                    camera[
                        "status"
                    ] = "online"

                self._add_to_queue(
                    cam_id,
                    frame
                )

            except Exception as e:

                print(
                    f"⚠️ {cam_id}: {e}"
                )

                camera[
                    "status"
                ] = "offline"

                time.sleep(
                    0.2
                )

        camera[
            "status"
        ] = "offline"

    # =========================================================
    # PHONE MJPEG CAPTURE
    # =========================================================

    def _capture_phone(
        self,
        cam_id
    ):

        camera = self.cameras[
            cam_id
        ]

        url = camera[
            "source"
        ]

        stop_event = self.stop_events[
            cam_id
        ]

        print(
            f"📱 {cam_id}: "
            f"phone capture started"
        )

        while (
            self.running
            and not stop_event.is_set()
        ):

            response = None

            try:

                camera[
                    "status"
                ] = "connecting"

                response = requests.get(
                    url,
                    stream=True,
                    timeout=(5, 30),
                    headers={
                        "User-Agent":
                            "Mozilla/5.0",
                        "Accept":
                            "*/*"
                    }
                )

                response.raise_for_status()

                camera[
                    "status"
                ] = "online"

                buffer = b""

                last_frame_received = (
                    time.time()
                )

                print(
                    f"✅ {cam_id}: "
                    f"PHONE STREAM CONNECTED"
                )

                for chunk in response.iter_content(
                    chunk_size=4096
                ):

                    if (
                        not self.running
                        or stop_event.is_set()
                    ):

                        break

                    if not chunk:
                        continue

                    buffer += chunk

                    if len(buffer) > (
                        5 * 1024 * 1024
                    ):

                        buffer = buffer[
                            -1024 * 1024:
                        ]

                    while True:

                        start = buffer.find(
                            b"\xff\xd8"
                        )

                        if start == -1:
                            break

                        end = buffer.find(
                            b"\xff\xd9",
                            start + 2
                        )

                        if end == -1:
                            break

                        jpg = buffer[
                            start:end + 2
                        ]

                        buffer = buffer[
                            end + 2:
                        ]

                        try:

                            img_array = (
                                np.frombuffer(
                                    jpg,
                                    dtype=np.uint8
                                )
                            )

                            frame = cv2.imdecode(
                                img_array,
                                cv2.IMREAD_COLOR
                            )

                        except Exception:

                            continue

                        if frame is None:
                            continue

                        frame = cv2.resize(
                            frame,
                            (640, 480)
                        )

                        timestamp = time.time()

                        with self.data_lock:

                            camera[
                                "last_frame"
                            ] = frame

                            camera[
                                "last_frame_time"
                            ] = timestamp

                            camera[
                                "status"
                            ] = "online"

                        last_frame_received = (
                            time.time()
                        )

                        self._add_to_queue(
                            cam_id,
                            frame
                        )

                    if (
                        time.time()
                        - last_frame_received
                        > 10
                    ):

                        print(
                            f"⚠️ {cam_id}: "
                            f"stream frozen"
                        )

                        break

            except Exception as e:

                print(
                    f"❌ {cam_id}: {e}"
                )

            finally:

                if response:

                    try:

                        response.close()

                    except Exception:
                        pass

            if (
                self.running
                and not stop_event.is_set()
            ):

                camera[
                    "status"
                ] = "reconnecting"

                stop_event.wait(
                    2
                )

        camera[
            "status"
        ] = "offline"

    # =========================================================
    # VIDEO FILE CAPTURE
    # =========================================================

    def _capture_video(
        self,
        cam_id
    ):

        camera = self.cameras[
            cam_id
        ]

        video_path = camera[
            "video_path"
        ]

        stop_event = self.stop_events[
            cam_id
        ]

        fps = camera.get(
            "fps",
            30
        )

        if fps <= 0:
            fps = 30

        frame_delay = 1.0 / fps

        print()

        print(
            f"🎬 {cam_id}: "
            f"VIDEO CAPTURE STARTING"
        )

        print(
            f"🎬 File: {video_path}"
        )

        cap = cv2.VideoCapture(
            video_path
        )

        if not cap.isOpened():

            camera[
                "status"
            ] = "error"

            print(
                f"❌ {cam_id}: "
                f"FAILED TO OPEN VIDEO"
            )

            return

        camera[
            "status"
        ] = "online"

        print(
            f"✅ {cam_id}: "
            f"VIDEO FILE OPENED"
        )

        frame_count = 0

        while (
            self.running
            and not stop_event.is_set()
        ):

            try:

                ret, frame = cap.read()

                # -------------------------------------------------
                # End of video
                # -------------------------------------------------

                if not ret:

                    if camera.get(
                        "loop",
                        True
                    ):

                        cap.set(
                            cv2.CAP_PROP_POS_FRAMES,
                            0
                        )

                        camera[
                            "current_frame"
                        ] = 0

                        continue

                    camera[
                        "status"
                    ] = "offline"

                    break

                # -------------------------------------------------
                # Resize
                # -------------------------------------------------

                frame = cv2.resize(
                    frame,
                    (640, 480)
                )

                timestamp = time.time()

                # -------------------------------------------------
                # Save latest raw frame
                # -------------------------------------------------

                with self.data_lock:

                    camera[
                        "last_frame"
                    ] = frame

                    camera[
                        "last_frame_time"
                    ] = timestamp

                    camera[
                        "status"
                    ] = "online"

                    camera[
                        "current_frame"
                    ] = int(
                        cap.get(
                            cv2.CAP_PROP_POS_FRAMES
                        )
                    )

                self._add_to_queue(
                    cam_id,
                    frame
                )

                frame_count += 1

                if frame_count == 1:

                    print(
                        f"🎬 {cam_id}: "
                        f"FIRST FRAME RECEIVED"
                    )

                if frame_count % 100 == 0:

                    print(
                        f"🎬 {cam_id}: "
                        f"{frame_count} frames captured"
                    )

                stop_event.wait(
                    frame_delay
                )

            except Exception as e:

                print(
                    f"❌ {cam_id}: "
                    f"video error: {e}"
                )

                camera[
                    "status"
                ] = "error"

                time.sleep(
                    0.2
                )

        cap.release()

        camera[
            "status"
        ] = "offline"

        print(
            f"🛑 {cam_id}: "
            f"video capture stopped"
        )

    # =========================================================
    # ADD FRAME TO QUEUE
    # =========================================================

    def _add_to_queue(
        self,
        cam_id,
        frame
    ):

        q = self.camera_queues.get(
            cam_id
        )

        if q is None:
            return

        try:

            if q.full():

                try:

                    q.get_nowait()

                except queue.Empty:
                    pass

            q.put_nowait(
                frame
            )

        except queue.Full:
            pass

    # =========================================================
    # GET PROCESSED FRAME
    # =========================================================

    def get_frame(
        self,
        cam_id
    ):

        camera = self.cameras.get(
            cam_id
        )

        if camera is None:
            return None

        with self.data_lock:

            processed = camera.get(
                "processed_frame"
            )

            if processed is not None:

                return processed.copy()

            raw = camera.get(
                "last_frame"
            )

            if raw is not None:

                return raw.copy()

        return None

    # =========================================================
    # GET RAW FRAME
    # =========================================================

    def get_raw_frame(
        self,
        cam_id
    ):

        camera = self.cameras.get(
            cam_id
        )

        if camera is None:
            return None

        with self.data_lock:

            frame = camera.get(
                "last_frame"
            )

            if frame is not None:

                return frame.copy()

        return None

    # =========================================================
    # GET PROCESSED FRAME DIRECTLY
    # =========================================================

    def get_processed_frame(
        self,
        cam_id
    ):

        camera = self.cameras.get(
            cam_id
        )

        if camera is None:
            return None

        with self.data_lock:

            frame = camera.get(
                "processed_frame"
            )

            if frame is not None:

                return frame.copy()

        return None

    # =========================================================
    # GET DETECTIONS
    # =========================================================

    def get_detections(
        self,
        cam_id
    ):

        camera = self.cameras.get(
            cam_id
        )

        if camera is None:
            return []

        with self.data_lock:

            return list(
                camera.get(
                    "detections",
                    []
                )
            )

    # =========================================================
    # GET VEHICLE COUNT
    # =========================================================

    def get_vehicle_count(
        self,
        cam_id
    ):

        camera = self.cameras.get(
            cam_id
        )

        if camera is None:
            return 0

        with self.data_lock:

            return int(
                camera.get(
                    "vehicle_count",
                    0
                )
            )

    # =========================================================
    # GET QUEUED FRAME
    # =========================================================

    def get_queued_frame(
        self,
        cam_id
    ):

        try:

            return self.camera_queues[
                cam_id
            ].get_nowait()

        except (
            queue.Empty,
            KeyError
        ):

            return None

    # =========================================================
    # STOP CAMERA
    # =========================================================

    def stop_camera(
        self,
        cam_id
    ):

        if cam_id not in self.cameras:
            return False

        print(
            f"⏹️ Stopping {cam_id}"
        )

        if cam_id in self.stop_events:

            self.stop_events[
                cam_id
            ].set()

        camera = self.cameras[
            cam_id
        ]

        if camera["type"] == "laptop":

            try:

                if camera["source"]:

                    camera[
                        "source"
                    ].release()

            except Exception:
                pass

        with self.data_lock:

            camera[
                "status"
            ] = "offline"

            camera[
                "last_frame"
            ] = None

            camera[
                "processed_frame"
            ] = None

            camera[
                "last_frame_time"
            ] = 0

            camera[
                "last_processed_source_time"
            ] = 0

            camera[
                "detections"
            ] = []

            camera[
                "vehicle_count"
            ] = 0

        return True

    # =========================================================
    # REMOVE CAMERA
    # =========================================================

    def remove_camera(
        self,
        cam_id
    ):

        if cam_id not in self.cameras:
            return False

        self.stop_camera(
            cam_id
        )

        self.cameras.pop(
            cam_id,
            None
        )

        self.camera_queues.pop(
            cam_id,
            None
        )

        self.stop_events.pop(
            cam_id,
            None
        )

        self.threads.pop(
            cam_id,
            None
        )

        print(
            f"🗑️ {cam_id} removed"
        )

        return True

    # =========================================================
    # CAMERA LIST
    # =========================================================

    def get_all_cameras(
        self
    ):

        result = []

        now = time.time()

        with self.data_lock:

            for cam_id, camera in (
                self.cameras.items()
            ):

                last_frame_time = camera.get(
                    "last_frame_time",
                    0
                )

                if last_frame_time:

                    frame_age = (
                        now
                        - last_frame_time
                    )

                else:

                    frame_age = None

                status = camera.get(
                    "status",
                    "unknown"
                )

                if (
                    frame_age is not None
                    and frame_age > 10
                    and camera["type"] != "video"
                ):

                    status = "offline"

                result.append({

                    "id": cam_id,

                    "name": camera.get(
                        "name",
                        cam_id
                    ),

                    "location": camera.get(
                        "location",
                        "Unknown"
                    ),

                    "type": camera.get(
                        "type",
                        "unknown"
                    ),

                    "status": status,

                    "has_frame": (
                        camera.get(
                            "last_frame"
                        ) is not None
                    ),

                    "has_processed_frame": (
                        camera.get(
                            "processed_frame"
                        ) is not None
                    ),

                    "frame_age": frame_age,

                    # -------------------------------------------------
                    # AI INFORMATION
                    # -------------------------------------------------

                    "vehicle_count": int(
                        camera.get(
                            "vehicle_count",
                            0
                        )
                    ),

                    "detections": list(
                        camera.get(
                            "detections",
                            []
                        )
                    ),

                    "last_detection_time": (
                        camera.get(
                            "last_detection_time",
                            0
                        )
                    ),

                    # -------------------------------------------------
                    # CAMERA INFORMATION
                    # -------------------------------------------------

                    "ip": camera.get(
                        "ip",
                        ""
                    ),

                    "port": camera.get(
                        "port",
                        ""
                    ),

                    "fps": camera.get(
                        "fps",
                        None
                    ),

                    "total_frames": camera.get(
                        "total_frames",
                        None
                    ),

                    "current_frame": camera.get(
                        "current_frame",
                        None
                    ),

                    "latitude": camera.get(
                        "latitude",
                        0
                    ),

                    "longitude": camera.get(
                        "longitude",
                        0
                    )
                })

        return result

    # =========================================================
    # STOP EVERYTHING
    # =========================================================

    def stop(self):

        print(
            "🛑 Stopping all cameras..."
        )

        self.running = False

        # Stop AI worker
        self.ai_stop_event.set()

        # Stop camera workers
        for event in (
            self.stop_events.values()
        ):

            event.set()

        # Release laptop camera
        for camera in (
            self.cameras.values()
        ):

            if camera["type"] == "laptop":

                try:

                    if camera["source"]:

                        camera[
                            "source"
                        ].release()

                except Exception:
                    pass

            camera[
                "status"
            ] = "offline"

        # Wait briefly for AI worker
        if (
            self.ai_thread is not None
            and self.ai_thread.is_alive()
        ):

            self.ai_thread.join(
                timeout=2
            )

        self.threads.clear()

        self.ai_thread = None

        print(
            "✅ Camera Manager Stopped"
        )