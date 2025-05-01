// store/useWorkoutStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Workout } from '../types/workout';

interface WorkoutState {
  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  fetchWorkouts: async () => {
    try {
      const response = await axios.get<Workout[]>(`${process.env.NEXT_PUBLIC_API_URL}/workouts`);
      set({ workouts: response.data });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  },
}));