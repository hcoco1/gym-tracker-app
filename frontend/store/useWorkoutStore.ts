import { create } from 'zustand';
import axios from 'axios';

interface Workout {
  id: number;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  exercise_type: string;
  created_at: string;
}

interface WorkoutState {
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void; // Add this
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: number) => void;
  fetchWorkouts: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  setWorkouts: (workouts) => set({ workouts }), // Add this
  addWorkout: (workout) => 
    set((state) => ({ workouts: [workout, ...state.workouts] })),
  removeWorkout: (id) => 
    set((state) => ({ workouts: state.workouts.filter(w => w.id !== id) })),

  // Update fetchWorkouts to use axios
  fetchWorkouts: async () => {
    try {
      const response = await axios.get('http://localhost:8000/workouts/');
      set({ workouts: response.data });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
}));