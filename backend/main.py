from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Pomodoro Timer backend!"}

class SessionInput(BaseModel):
    duration_minutes: int
    status: str

@app.post("/session")
async def create_session(session: SessionInput):
    print("Session received:", session.dict())
    return {"message": "Logged successfully"}