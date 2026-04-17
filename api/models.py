from sqlalchemy import Column, Integer, String, BigInteger, DateTime
from sqlalchemy.sql import func
from database import Base


class Hall(Base):
    __tablename__ = "hall"

    id = Column(Integer, primary_key=True, autoincrement=True)
    hallid = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    status = Column(String(255))
    type = Column(String(255))
    description = Column(String(255))
    price = Column(BigInteger)
    capacity = Column(BigInteger)
    created_on = Column(DateTime, server_default=func.now())
    updated_on = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Item(Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True, autoincrement=True)
    itemid = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    price = Column(BigInteger)
    status = Column(String(255), nullable=False)
    created_on = Column(DateTime, server_default=func.now())
    updated_on = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Booking(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bookingid = Column(String(255), unique=True, nullable=False)
    fromdate = Column(DateTime)
    todate = Column(DateTime)
    customer = Column(String(255))
    phone = Column(String(255))
    address = Column(String(255))
    email = Column(String(255))
    numberOfPpl = Column(Integer)
    allItems = Column(String(5000))
    allHall = Column(String(5000))
    damage = Column(BigInteger, default=0)
    gst = Column(BigInteger, default=0)
    service_tax = Column(BigInteger, default=0)
    total = Column(BigInteger, default=0)
    paid = Column(BigInteger, default=0)
    invoice_num = Column(String(255))
    gst_num = Column(String(255))
    created_on = Column(DateTime, server_default=func.now())
    updated_on = Column(DateTime, server_default=func.now(), onupdate=func.now())
