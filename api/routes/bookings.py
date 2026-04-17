from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(tags=["bookings"])


@router.get("/bookings", response_model=List[schemas.BookingOut])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(models.Booking).order_by(models.Booking.created_on.desc()).all()


@router.get("/booking/{booking_id}", response_model=schemas.BookingOut)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.bookingid == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("/booking", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    db_booking = models.Booking(**booking.model_dump())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.put("/booking/{booking_id}", response_model=schemas.BookingOut)
def update_booking(booking_id: str, booking: schemas.BookingUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.bookingid == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    for key, value in booking.model_dump(exclude_unset=True).items():
        setattr(db_booking, key, value)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete("/booking/{booking_id}", response_model=List[schemas.BookingOut])
def delete_booking(booking_id: str, db: Session = Depends(get_db)):
    db.query(models.Booking).filter(models.Booking.bookingid == booking_id).delete()
    db.commit()
    return db.query(models.Booking).order_by(models.Booking.created_on.desc()).all()
