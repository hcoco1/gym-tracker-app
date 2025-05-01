import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutTable from '../components/WorkoutTable';
import Navbar from '../components/Navbar';

export default function Home() {
  const { workouts, fetchWorkouts } = useWorkoutStore();

  // Fetch workouts when the component mounts
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Handle delete functionality
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/workouts/${id}`);
      // Remove from local store
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WorkoutForm />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <WorkoutTable workouts={workouts} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
