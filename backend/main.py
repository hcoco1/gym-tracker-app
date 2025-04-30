from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Gym Tracker API"}

@app.get("/workouts")
def get_workouts():
    return [
        {"id": 1, "name": "Push-ups", "sets": 3, "reps": 15}
    ]