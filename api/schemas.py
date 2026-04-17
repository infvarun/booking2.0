from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HallCreate(BaseModel):
    hallid: str
    name: str
    status: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    capacity: Optional[int] = None


class HallUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    capacity: Optional[int] = None


class HallOut(HallCreate):
    id: int
    created_on: Optional[datetime] = None
    updated_on: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ItemCreate(BaseModel):
    itemid: str
    name: str
    price: Optional[int] = None
    status: str


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    status: Optional[str] = None


class ItemOut(ItemCreate):
    id: int
    created_on: Optional[datetime] = None
    updated_on: Optional[datetime] = None

    model_config = {"from_attributes": True}


class BookingCreate(BaseModel):
    bookingid: str
    fromdate: Optional[datetime] = None
    todate: Optional[datetime] = None
    customer: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    numberOfPpl: Optional[int] = None
    allItems: Optional[str] = None
    allHall: Optional[str] = None
    damage: Optional[int] = 0
    gst: Optional[int] = 0
    service_tax: Optional[int] = 0
    total: Optional[int] = 0
    paid: Optional[int] = 0
    invoice_num: Optional[str] = None
    gst_num: Optional[str] = None


class BookingUpdate(BaseModel):
    fromdate: Optional[datetime] = None
    todate: Optional[datetime] = None
    customer: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    numberOfPpl: Optional[int] = None
    allItems: Optional[str] = None
    allHall: Optional[str] = None
    damage: Optional[int] = None
    gst: Optional[int] = None
    service_tax: Optional[int] = None
    total: Optional[int] = None
    paid: Optional[int] = None
    invoice_num: Optional[str] = None
    gst_num: Optional[str] = None


class BookingOut(BookingCreate):
    id: int
    created_on: Optional[datetime] = None
    updated_on: Optional[datetime] = None

    model_config = {"from_attributes": True}
