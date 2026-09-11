import sys
import os

# Add the current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

# Create engine
engine = create_engine("sqlite:///./trinetra.db", connect_args={"check_same_thread": False})

# Import and create all tables
from app.models.models import Base
Base.metadata.create_all(bind=engine)

# Verify tables
inspector = inspect(engine)
tables = inspector.get_table_names()
print("Tables created:", tables)

# Create a session
Session = sessionmaker(bind=engine)
db = Session()

# Create some test data
from app.models.models import Vehicle, Camera, Alert
from datetime import datetime

# Add a test vehicle
vehicle1 = Vehicle(
    plate_number="ABC-1234",
    make="Toyota",
    model="Camry",
    color="White",
    vehicle_type="Sedan",
    owner_name="John Doe"
)
db.add(vehicle1)

# Add a test camera
camera1 = Camera(
    name="Junction 12 - North",
    location="MG Road",
    latitude=12.9716,
    longitude=77.5946,
    status="active",
    ip_address="192.168.1.101",
    rtsp_url="rtsp://admin:admin@192.168.1.101:554/stream1",
    direction="North",
    resolution="4K"
)
db.add(camera1)

# Commit
db.commit()

# Verify data
vehicles = db.query(Vehicle).all()
cameras = db.query(Camera).all()

print(f"Created {len(vehicles)} vehicles:")
for v in vehicles:
    print(f"  - {v.plate_number}: {v.make} {v.model} ({v.color})")

print(f"Created {len(cameras)} cameras:")
for c in cameras:
    print(f"  - {c.name}: {c.location}")

db.close()
print("\nDatabase initialized successfully!")