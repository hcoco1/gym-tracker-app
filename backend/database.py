from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
DBNAME = os.getenv("DB_NAME")

# PostgreSQL connection URL
SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# SQLAlchemy setup
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Workout(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True)
    exercise = Column(String)
    exercise_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    sets = relationship("WorkoutSet", back_populates="workout", cascade="all, delete-orphan")

class WorkoutSet(Base):
    __tablename__ = "workout_sets"
    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workouts.id'))
    set_number = Column(Integer)
    workout = relationship("Workout", back_populates="sets")
    reps = relationship("WorkoutRep", back_populates="set", cascade="all, delete-orphan")

class WorkoutRep(Base):
    __tablename__ = "workout_reps"
    id = Column(Integer, primary_key=True)
    set_id = Column(Integer, ForeignKey('workout_sets.id'))
    rep_number = Column(Integer)
    weight = Column(Float)
    set = relationship("WorkoutSet", back_populates="reps")
    
    
    if __name__ == "__main__":
        # This will create all tables in the database
        print("Tables created successfully.")









