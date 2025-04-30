// frontend/pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import Navbar from '../components/Navbar';

export default function Home() {
  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts on initial load
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/workouts/');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm text-blue-600">Total Workouts</h3>
                  <p className="text-2xl font-bold">{workouts.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm text-green-600">Total Sets</h3>
                  <p className="text-2xl font-bold">
                    {workouts.reduce((sum, workout) => sum + workout.sets, 0)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm text-purple-600">Total Reps</h3>
                  <p className="text-2xl font-bold">
                    {workouts.reduce((sum, workout) => sum + workout.reps, 0)}
                  </p>
                </div>
              </div>

              {/* Workouts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map(workout => (
                  <div key={workout.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{workout.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-4 text-gray-600">
                      <div>
                        <span className="font-semibold">{workout.sets}</span> sets
                      </div>
                      <div>
                        <span className="font-semibold">{workout.reps}</span> reps
                      </div>
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