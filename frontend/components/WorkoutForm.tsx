// frontend/components/WorkoutForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { useWorkoutStore } from '../store/useWorkoutStore';

// Add type for exercise categories
type ExerciseType = 'push' | 'pull' | 'legs' | 'core' | 'cardio';

export default function WorkoutForm() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('push');
  const { addWorkout } = useWorkoutStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/workouts/', {
        exercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight), // Convert to number
        exercise_type: exerciseType,
      });
      
      addWorkout({
        ...response.data,
        // Add missing fields for Zustand
        name: response.data.exercise, // Map to existing name field if needed
        created_at: new Date().toISOString(),
      });
      
      // Reset form
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setExerciseType('push');
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Add New Workout</h2>
      <div className="space-y-2">
        {/* Exercise Input */}
        <div>
          <label className="block mb-1">Exercise:</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Exercise Type Selector */}
        <div>
          <label className="block mb-1">Category:</label>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
            className="w-full p-2 border rounded"
          >
            <option value="push">Push (Chest/Shoulders/Triceps)</option>
            <option value="pull">Pull (Back/Biceps)</option>
            <option value="legs">Legs</option>
            <option value="core">Core</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        {/* Weight Input */}
        <div>
          <label className="block mb-1">Weight (kg):</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Sets/Reps Inputs (keep existing) */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Log Workout
        </button>
      </div>
    </form>
  );
}