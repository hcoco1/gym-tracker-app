export interface Workout {
  id: number;
  exercise: string;
  exercise_type: string;
  created_at: string;
  sets: Array<{
    set_number: number;
    reps: Array<{
      rep_number: number;
      weight: number;
    }>;
  }>;
}
