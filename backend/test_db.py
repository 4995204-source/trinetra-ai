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

# Test inserting a vehicle
from app.models.models import Vehicle
from datetime import datetime

Session = sessionmaker(bind=engine)
db = Session()

# Create a test vehicle
test_vehicle = Vehicle(
    plate_number="TEST-1234",
    make="Toyota",
    model="Camry",
    color="White",
    vehicle_type="Sedan"
)
db.add(test_vehicle)
db.commit()
db.refresh(test_vehicle)

print(f"Created vehicle with ID: {test_vehicle.id}")
print(f"Plate number: {test_vehicle.plate_number}")

# Query the vehicle
vehicles = db.query(Vehicle).all()
print(f"Total vehicles: {len(vehicles)}")
for v in vehicles:
    print(f"  - {v.plate_number} ({v.make} {v.model})")

db.close()
print("Database test completed successfully!")