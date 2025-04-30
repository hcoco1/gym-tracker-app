// frontend/pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/workouts')
      .then(response => setWorkouts(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gym Tracker</h1>
      <div>
        {workouts.map(workout => (
          <div key={workout.id} className="p-4 border rounded mb-2">
            <h2 className="font-bold">{workout.name}</h2>
            <p>{workout.sets} sets x {workout.reps} reps</p>
          </div>
        ))}
      </div>
    </div>
  );
}