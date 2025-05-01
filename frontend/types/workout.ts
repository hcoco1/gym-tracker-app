// types/workout.ts
export interface WorkoutRep {
  rep_number: number;
  weight: number;
}

export interface WorkoutSet {
  set_number: number;
  weight: number;
  reps: number;
  rep_objects?: WorkoutRep[];
}

export interface Workout {
  id: number;
  exercise: string;
  exercise_type: string;
  created_at: string;
  sets: WorkoutSet[];
}