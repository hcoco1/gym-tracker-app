import { create } from 'zustand';
import axios from 'axios';

interface Workout {
  id: number;
  exercise: string;
  reps: number;
  weight: number;
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

interface WorkoutState {
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: number) => void;
  fetchWorkouts: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  setWorkouts: (workouts: Workout[]) => set({ workouts }),
  addWorkout: (workout: Workout) => 
    set((state: WorkoutState) => ({ workouts: [workout, ...state.workouts] })),
  removeWorkout: (id: number) => 
    set((state: WorkoutState) => ({ workouts: state.workouts.filter((w: Workout) => w.id !== id) })),

  // Update fetchWorkouts to use axios
  fetchWorkouts: async () => {
    try {
      const response = await axios.get(
  process.env.NEXT_PUBLIC_API_URL + '/workouts'
);
      set({ workouts: response.data });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
}));






