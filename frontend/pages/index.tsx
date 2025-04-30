// frontend/pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gym Tracker</h1>
      <WorkoutForm />
      {/* Existing workout display code */}
    </div>
  );
}