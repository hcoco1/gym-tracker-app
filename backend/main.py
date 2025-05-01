# This is the main FastAPI application file for the workout tracking app.
# It includes the API endpoints for creating, retrieving, and deleting workouts.
# It also includes the necessary database setup and models.
from database import SessionLocal, engine, Workout, WorkoutSet, WorkoutRep
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload


app = FastAPI()

# ✅ Replace this with your actual frontend URL
origins = [
    "https://gym-tracker-app-nqup.vercel.app",
    "http://localhost:3000"  # Optional: useful for local testing
]

# ✅ Add CORS middleware before you define any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],    # Or restrict to ["GET", "POST", "DELETE", etc.]
    allow_headers=["*"],    # Allow all headers
)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RepCreate(BaseModel):
    rep_number: int
    weight: float

class SetCreate(BaseModel):
    set_number: int
    reps: List[RepCreate]

class WorkoutCreate(BaseModel):
    exercise: str
    exercise_type: str
    sets: List[SetCreate]

class WorkoutResponse(WorkoutCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Update your GET endpoint
@app.get("/workouts", response_model=List[WorkoutResponse])
def get_workouts(db: Session = Depends(get_db)):
    return db.query(Workout).options(
        joinedload(Workout.sets).joinedload(WorkoutSet.reps)
    ).all()

@app.post("/workouts/")
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    db_workout = Workout(
        exercise=workout.exercise,
        exercise_type=workout.exercise_type,
        sets=[
            WorkoutSet(
                set_number=set_data.set_number,
                reps=[
                    WorkoutRep(
                        rep_number=rep_data.rep_number,
                        weight=rep_data.weight
                    ) for rep_data in set_data.reps
                ]
            ) for set_data in workout.sets
        ]
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@app.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted successfully"}
    
