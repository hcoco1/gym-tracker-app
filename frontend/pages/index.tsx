// pages/index.tsx
import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import Navbar from '../components/Navbar';
import WorkoutDashboard from '../components/WorkoutDashboard';

export default function Home() {
  const { workouts, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/workouts/${id}`);
      useWorkoutStore.getState().removeWorkout(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Full error object:", error.toJSON());
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <WorkoutDashboard workouts={workouts} onDelete={handleDelete} />
      </main>
    </div>
  );
}