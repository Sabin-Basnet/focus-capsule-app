from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import engine
from sqlmodel import Field, SQLModel, create_engine, Session, table
import sqlmodel

app = FastAPI()

# Enable CORS for any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# set up database
database_file_name = 'focus.db'
sqlite_url = f"sqlite:///{database_file_name}"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

# Create datamodel
class FocusSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    duration_minutes: int
    status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# create tables automatically on app startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# database connection session dependancy
def get_db():
    with Session(engine) as session:
        yield session

# core routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Pomodoro Timer backend!"}


@app.post("/session")
async def create_session(session_data: FocusSession, db: Session=Depends(get_db)):
    # add sql table tracking
    db.app(session_data)
    db.commit()
    db.refresh(session_data)

    print(f"Saved to Database, ID -> {session_data.id}, Created At:{session_data.created_at}")
    return {"message": "Logged successfully to database","id":session_data.id}