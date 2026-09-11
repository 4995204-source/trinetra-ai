import requests
import cv2
import numpy as np

url = "http://192.168.137.61:8080/video"

print("Connecting...")

with requests.get(
    url,
    stream=True,
    timeout=(5, 15)
) as response:

    print("Status:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))

    buffer = b""

    for chunk in response.iter_content(chunk_size=4096):

        buffer += chunk

        start = buffer.find(b'\xff\xd8')
        end = buffer.find(b'\xff\xd9')

        if start != -1 and end != -1:

            jpg = buffer[start:end + 2]
            buffer = buffer[end + 2:]

            frame = cv2.imdecode(
                np.frombuffer(jpg, np.uint8),
                cv2.IMREAD_COLOR
            )

            if frame is not None:

                cv2.imshow("TRINETRA PHONE", frame)

                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

cv2.destroyAllWindows()