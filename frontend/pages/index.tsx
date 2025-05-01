import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutTable from '../components/WorkoutTable';
import Navbar from '../components/Navbar';

export default function Home() {
  const { workouts, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

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
  
  

  const totalSets = workouts.reduce((sum, workout) => sum + (workout.sets?.length || 0), 0);
  const totalReps = workouts.reduce((sum, workout) =>
    sum + (workout.sets?.reduce((setSum, set) => setSum + (set.reps?.length || 0), 0) || 0), 0);
  const totalVolume = Number(workouts.reduce((sum, workout) =>
    sum + (workout.sets?.reduce((setSum, set) =>
      setSum + (set.reps?.reduce((repSum, rep) => repSum + (rep.weight || 0), 0) || 0), 0) || 0), 0).toFixed(1));

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm text-blue-600">Total Sets</h3>
                  <p className="text-2xl font-bold">{totalSets}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm text-green-600">Total Reps</h3>
                  <p className="text-2xl font-bold">{totalReps}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm text-purple-600">Total Volume</h3>
                  <p className="text-2xl font-bold">{totalVolume}kg</p>
                </div>
              </div>
              <WorkoutTable workouts={workouts} onDelete={handleDelete} />



            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
