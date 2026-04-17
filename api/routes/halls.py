from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(tags=["halls"])


@router.get("/halls", response_model=List[schemas.HallOut])
def get_halls(db: Session = Depends(get_db)):
    return db.query(models.Hall).order_by(models.Hall.created_on).all()


@router.get("/hall/{hall_id}", response_model=schemas.HallOut)
def get_hall(hall_id: str, db: Session = Depends(get_db)):
    hall = db.query(models.Hall).filter(models.Hall.hallid == hall_id).first()
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    return hall


@router.post("/hall", response_model=schemas.HallOut)
def create_hall(hall: schemas.HallCreate, db: Session = Depends(get_db)):
    db_hall = models.Hall(**hall.model_dump())
    db.add(db_hall)
    db.commit()
    db.refresh(db_hall)
    return db_hall


@router.put("/hall/{hall_id}", response_model=schemas.HallOut)
def update_hall(hall_id: str, hall: schemas.HallUpdate, db: Session = Depends(get_db)):
    db_hall = db.query(models.Hall).filter(models.Hall.hallid == hall_id).first()
    if not db_hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    for key, value in hall.model_dump(exclude_unset=True).items():
        setattr(db_hall, key, value)
    db.commit()
    db.refresh(db_hall)
    return db_hall


@router.delete("/hall/{hall_id}", response_model=List[schemas.HallOut])
def delete_hall(hall_id: str, db: Session = Depends(get_db)):
    db_hall = db.query(models.Hall).filter(models.Hall.hallid == hall_id).first()
    if not db_hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    db.delete(db_hall)
    db.commit()
    return db.query(models.Hall).order_by(models.Hall.created_on).all()
