import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import halls, items, bookings

app = FastAPI(title="Deo Vihar Booking API", version="2.0.0")


@app.on_event("startup")
def initialize_database() -> None:
    if os.getenv("RUN_DB_CREATE_ALL", "").lower() in {"1", "true", "yes", "on"}:
        Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(halls.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
