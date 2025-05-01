// pages/index.tsx
import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import Navbar from '../components/Navbar';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutListCard from '../components/WorkoutListCard';
import WorkoutTable from '../components/WorkoutTable';
import { Workout } from '../types/workout';

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
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WorkoutForm />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Mobile view (cards) */}
            <div className="lg:hidden">
              <WorkoutListCard workouts={workouts} onDelete={handleDelete} />
            </div>
            
            {/* Desktop view (table) */}
            <div className="hidden lg:block bg-white rounded-lg shadow p-6">
              <WorkoutTable workouts={workouts} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}