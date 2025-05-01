// store/useWorkoutStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Workout } from '../types/workout';

interface WorkoutState {
  workouts: Workout[];
  loading: boolean;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: number) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  loading: false,

  fetchWorkouts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<Workout[]>(`${process.env.NEXT_PUBLIC_API_URL}/workouts`);
      set({ workouts: response.data });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      set({ loading: false });
    }
  },

  addWorkout: (workout) => set((state) => ({
    workouts: [workout, ...state.workouts]
  })),

  removeWorkout: (id) => set((state) => ({
    workouts: state.workouts.filter((w) => w.id !== id)
  }))
}));