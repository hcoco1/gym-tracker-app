// frontend/components/WorkoutForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { useWorkoutStore } from '../store/useWorkoutStore';  // Add this import

export default function WorkoutForm() {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const { addWorkout } = useWorkoutStore();  // Get addWorkout from store

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/workouts/', {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
      });
      
      addWorkout(response.data);  // Now this works
      
      setName('');
      setSets('');
      setReps('');
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Add New Workout</h2>
      <div className="space-y-2">
        <div>
          <label className="block mb-1">Exercise:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Sets:</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Reps:</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Workout
        </button>
      </div>
    </form>
  );
}