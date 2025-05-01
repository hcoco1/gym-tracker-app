import { create } from 'zustand';
import axios from 'axios';

interface Rep {
  rep_number: number;
  weight: number;
  reps: number;
}

interface Set {
  set_number: number;
  reps: Rep[];
}

export interface Workout {
  id: number;
  exercise: string;
  exercise_type: string;
  created_at: string;
  sets: Set[];
}

interface WorkoutState {
  workouts: Workout[];
  loading: boolean;
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: number) => void;
  fetchWorkouts: () => Promise<void>;
  setLoading: (value: boolean) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  loading: false,

  // Set workouts
  setWorkouts: (workouts: Workout[]) => set({ workouts }),

  // Add a new workout to the list
  addWorkout: (workout: Workout) =>
    set((state) => ({ workouts: [workout, ...state.workouts] })),

  // Remove a workout by ID
  removeWorkout: (id: number) =>
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    })),

  // Fetch workouts from the backend
  fetchWorkouts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/workouts`);
      set({ workouts: response.data });
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Set the loading state (e.g., for form submission)
  setLoading: (value: boolean) => set({ loading: value }),
}));
