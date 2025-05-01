import { useState } from 'react';
import axios from 'axios';
import { useWorkoutStore } from '../store/useWorkoutStore';

const exercisesByType = {
  push: ["Barbell Bench Press", "Incline Dumbbell Press", "Overhead Shoulder Press", "Lateral Raises", "Dips", "Tricep Pushdowns", "Cable Chest Flys"],
  pull: ["Pull-Ups", "Bent-Over Rows", "Lat Pulldowns", "Seated Cable Rows", "Face Pulls", "Barbell Curls", "Incline Dumbbell Curls"],
  legs: ["Barbell Squats", "Romanian Deadlifts", "Walking Lunges", "Leg Press", "Leg Extensions", "Glute Kickbacks", "Hip Thrusts", "Bulgarian Split Squats", "Deadlifts", "Leg Curls", "Abductor Machine"],
  core: ["Cable Woodchoppers", "Leg Raises", "Planks", "Cable Crunches", "Russian Twists", "Mountain Climbers", "Flutter Kicks"],
  cardio: ["Cycling", "Treadmill", "Swimming"]
};

interface SimpleSet {
  reps: number;
  weight: number;
}

export default function WorkoutForm() {
  const [exerciseType, setExerciseType] = useState<keyof typeof exercisesByType>('push');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState<SimpleSet[]>([{ reps: 0, weight: 0 }]);
  const { fetchWorkouts } = useWorkoutStore();

  const handleSetChange = (index: number, field: 'reps' | 'weight', value: string) => {
    const newSets = [...sets];
    newSets[index][field] = parseFloat(value) || 0;
    setSets(newSets);
  };

  const handleSetAdd = () => {
    setSets(prev => [...prev, { reps: 0, weight: 0 }]);
  };

  const handleSetRemove = (index: number) => {
    if (sets.length > 1) {
      setSets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExercise) {
      alert('Please select an exercise');
      return;
    }

    const payload = {
      exercise: selectedExercise,
      exercise_type: exerciseType,
      sets: sets.map((set, idx) => ({
        set_number: idx + 1,
        reps: [
          {
            rep_number: set.reps,
            weight: set.weight,
          }
        ]
      }))
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/workouts/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await fetchWorkouts();
      setSets([{ reps: 0, weight: 0 }]);
      setSelectedExercise('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        alert(`Error: ${error.response?.data?.detail?.[0]?.msg || error.message}`);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Log New Workout</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Workout Type</label>
          <select
            value={exerciseType}
            onChange={(e) => {
              setExerciseType(e.target.value as keyof typeof exercisesByType);
              setSelectedExercise('');
            }}
            className="w-full p-2 border rounded-md"
          >
            {Object.keys(exercisesByType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Exercise</option>
            {exercisesByType[exerciseType].map((exercise) => (
              <option key={exercise} value={exercise}>{exercise}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sets.map((set, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Set {index + 1}</h3>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleSetRemove(index)}
                  className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                >
                  Remove Set
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Reps</label>
                <input
                  type="number"
                  min="1"
                  value={set.reps}
                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={set.weight}
                  onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleSetAdd}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Add Set +
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Workout
        </button>
      </div>
    </form>
  );
}
