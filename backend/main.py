import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime
from pydantic import BaseModel
from database import SessionLocal, engine, Workout, WorkoutSet, WorkoutRep


app = FastAPI()

# Read CORS origins from environment
origins = os.getenv("CORS_ORIGINS", "").split(",")
origins = [origin.strip() for origin in origins if origin.strip()]

# Add CORS middleware - REMOVE THE MANUAL OPTIONS HANDLER
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Dependency
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

    
