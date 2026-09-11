from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, index=True)
    make = Column(String(50), nullable=True)
    model = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    vehicle_type = Column(String(20), nullable=True)
    owner_name = Column(String(100), nullable=True)
    is_stolen = Column(Boolean, default=False)
    is_wanted = Column(Boolean, default=False)
    last_seen = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    location = Column(String(200))
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String(20), default="active")
    ip_address = Column(String(45))
    rtsp_url = Column(String(500))
    direction = Column(String(20))
    resolution = Column(String(10), default="1080p")
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    alert_type = Column(String(50))
    severity = Column(String(20))
    description = Column(String(500))
    camera_id = Column(Integer, ForeignKey("cameras.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)

class Trajectory(Base):
    __tablename__ = "trajectories"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    path = Column(JSON)
    distance_km = Column(Float)
    average_speed = Column(Float)
    max_speed = Column(Float)