import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import Navbar from '../components/Navbar';

export default function Home() {
  const { workouts, fetchWorkouts, removeWorkout } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://gym-tracker-fastapi.onrender.com/workouts/${id}`);
      removeWorkout(id); // Update Zustand store
    } catch (error) {
      // Log the actual error object and its properties
      console.error("Delete error:", error);
      // Optionally log the specific error response if available
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
      alert('Failed to delete workout');
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map((workout) => (
                  <div key={workout.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{workout.exercise}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(workout.created_at).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
                          {workout.exercise_type?.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="space-y-2">
                      {workout.sets?.map((set, setIndex) => (
                        <div key={setIndex} className="text-sm border-l-2 border-blue-200 pl-2">
                          <div className="font-medium text-gray-700">Set {set.set_number}</div>
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            {set.reps?.map((rep, repIndex) => (
                              <div key={repIndex} className="text-gray-600">
                                Rep {rep.rep_number}:{" "}
                                <span className="text-gray-800 font-medium">{rep.weight}kg</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
