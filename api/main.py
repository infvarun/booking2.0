from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import halls, items, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Deo Vihar Booking API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(halls.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
