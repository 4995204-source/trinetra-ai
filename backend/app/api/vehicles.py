from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Vehicle
from app.schemas.schemas import VehicleCreate, VehicleUpdate, VehicleResponse

router = APIRouter()

@router.post("/", response_model=VehicleResponse)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(
    skip: int = 0, 
    limit: int = 100,
    plate_number: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    color: Optional[str] = None,
    is_stolen: Optional[bool] = None,
    is_wanted: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)
    
    if plate_number:
        query = query.filter(Vehicle.plate_number.contains(plate_number))
    if vehicle_type:
        query = query.filter(Vehicle.vehicle_type == vehicle_type)
    if color:
        query = query.filter(Vehicle.color == color)
    if is_stolen is not None:
        query = query.filter(Vehicle.is_stolen == is_stolen)
    if is_wanted is not None:
        query = query.filter(Vehicle.is_wanted == is_wanted)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle_update: VehicleUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    for key, value in vehicle_update.dict(exclude_unset=True).items():
        setattr(vehicle, key, value)
    
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}