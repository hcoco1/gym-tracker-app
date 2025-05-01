// components/WorkoutForm.tsx
import { useState } from 'react';
import axios from 'axios';

const exercisesByType = {
  push: ["Bench Press", "Shoulder Press"],
  pull: ["Pull Ups", "Rows"],
  legs: ["Squats", "Deadlifts"]
};

export default function WorkoutForm() {
  const [exerciseType, setExerciseType] = useState<keyof typeof exercisesByType>('push');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);

  const handleAddSet = () => setSets([...sets, { weight: '', reps: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post('https://gym-tracker-app-backend.onrender.com/workouts', {
        exercise: selectedExercise,
        exercise_type: exerciseType,
        sets: sets.map((set, index) => ({
          set_number: index + 1,
          reps: [{
            rep_number: 1, // Single rep per set
            weight: Number(set.weight)
          }]
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert('Workout saved successfully!');
      setSets([{ weight: '', reps: '' }]);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save workout');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <select
          value={exerciseType}
          onChange={(e) => setExerciseType(e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          {Object.keys(exercisesByType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Exercise</option>
          {exercisesByType[exerciseType].map((exercise) => (
            <option key={exercise} value={exercise}>{exercise}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {sets.map((set, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="number"
              placeholder="Weight"
              value={set.weight}
              onChange={(e) => {
                const newSets = [...sets];
                newSets[index].weight = e.target.value;
                setSets(newSets);
              }}
              className="p-2 border rounded flex-1"
              required
            />
            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => {
                const newSets = [...sets];
                newSets[index].reps = e.target.value;
                setSets(newSets);
              }}
              className="p-2 border rounded flex-1"
              required
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAddSet}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Add Set
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Workout
        </button>
      </div>
    </form>
  );
}