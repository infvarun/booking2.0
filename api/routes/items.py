from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(tags=["items"])


@router.get("/items", response_model=List[schemas.ItemOut])
def get_items(db: Session = Depends(get_db)):
    return db.query(models.Item).order_by(models.Item.created_on).all()


@router.get("/item/{item_id}", response_model=schemas.ItemOut)
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.itemid == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/item", response_model=schemas.ItemOut)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.put("/item/{item_id}", response_model=schemas.ItemOut)
def update_item(item_id: str, item: schemas.ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.itemid == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.model_dump(exclude_unset=True).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/item/{item_id}", response_model=List[schemas.ItemOut])
def delete_item(item_id: str, db: Session = Depends(get_db)):
    db.query(models.Item).filter(models.Item.itemid == item_id).delete()
    db.commit()
    return db.query(models.Item).order_by(models.Item.created_on).all()
