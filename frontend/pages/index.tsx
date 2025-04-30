import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import Navbar from '../components/Navbar';

export default function Home() {
  const { 
    workouts, 
    fetchWorkouts, 
    removeWorkout 
  } = useWorkoutStore();

  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/workouts/${id}`);
      removeWorkout(id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete workout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workout Form */}
          <div className="lg:col-span-1">
            <WorkoutForm />
          </div>

          {/* Workouts Dashboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Workouts</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* ... keep existing stats cards ... */}
              </div>

              {/* Workouts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map(workout => (
                  <div key={workout.id} className="p-4 border rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{workout.name}</h3>
                        <p className="text-gray-600">
                          {workout.sets} sets x {workout.reps} reps
                        </p>
                        <small className="text-gray-400">
                          {new Date(workout.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <button 
                        onClick={() => handleDelete(workout.id)}
                        className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
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