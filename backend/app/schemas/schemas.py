from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class VehicleBase(BaseModel):
    plate_number: str
    make: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    vehicle_type: Optional[str] = None
    owner_name: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    is_stolen: Optional[bool] = None
    is_wanted: Optional[bool] = None

class VehicleResponse(VehicleBase):
    id: int
    is_stolen: bool
    is_wanted: bool
    last_seen: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class CameraBase(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    ip_address: str
    rtsp_url: str
    direction: str
    resolution: str

class CameraCreate(CameraBase):
    pass

class CameraUpdate(CameraBase):
    status: Optional[str] = None

class CameraResponse(CameraBase):
    id: int
    status: str
    last_heartbeat: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    alert_type: str
    severity: str
    description: str

class AlertCreate(AlertBase):
    vehicle_id: Optional[int] = None
    camera_id: Optional[int] = None

class AlertResponse(AlertBase):
    id: int
    timestamp: datetime
    resolved: bool
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TrajectoryBase(BaseModel):
    vehicle_id: int
    start_time: datetime
    end_time: datetime
    path: List[Dict[str, Any]]
    distance_km: float
    average_speed: float
    max_speed: float

class TrajectoryResponse(TrajectoryBase):
    id: int

    class Config:
        from_attributes = True
