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

interface RepData {
  weight: string;
  rep_number: number;
}

interface SetData {
  reps: RepData[];
}

export default function WorkoutForm() {
  const [exerciseType, setExerciseType] = useState<keyof typeof exercisesByType>('push');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState<SetData[]>([{ reps: [{ weight: '', rep_number: 1 }] }]);
  const { fetchWorkouts } = useWorkoutStore();

  const handleSetAdd = () => {
    setSets(prev => [...prev, { reps: [{ weight: '', rep_number: 1 }] }]);
  };

  const handleSetRemove = (index: number) => {
    if (sets.length > 1) {
      setSets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleRepAdd = (setIndex: number) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[setIndex].reps.push({ 
        weight: '', 
        rep_number: newSets[setIndex].reps.length + 1 
      });
      return newSets;
    });
  };

  const handleRepRemove = (setIndex: number, repIndex: number) => {
    if (sets[setIndex].reps.length > 1) {
      setSets(prev => {
        const newSets = [...prev];
        newSets[setIndex].reps = newSets[setIndex].reps.filter((_, i) => i !== repIndex);
        // Update rep numbers after removal
        newSets[setIndex].reps = newSets[setIndex].reps.map((rep, i) => ({
          ...rep,
          rep_number: i + 1
        }));
        return newSets;
      });
    }
  };

  const handleWeightChange = (setIndex: number, repIndex: number, value: string) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[setIndex].reps[repIndex].weight = value;
      return newSets;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExercise) {
      alert('Please select an exercise');
      return;
    }

    // Validate all reps have valid weights
    const hasInvalidReps = sets.some(set => 
      set.reps.some(rep => 
        isNaN(parseFloat(rep.weight)) || 
        parseFloat(rep.weight) < 0
      )
    );

    if (hasInvalidReps) {
      alert('Please enter valid weight (≥0) for all reps');
      return;
    }

    try {
      const payload = {
        exercise: selectedExercise,
        exercise_type: exerciseType,
        sets: sets.map((set, setIndex) => ({
          set_number: setIndex + 1,
          reps: set.reps.map(rep => ({
            rep_number: rep.rep_number,
            weight: Number(rep.weight)
          }))
        }))
      };

      console.log('Sending payload:', payload);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      await fetchWorkouts();
      setSets([{ reps: [{ weight: '', rep_number: 1 }] }]);
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
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workout Type</label>
            <select
              value={exerciseType}
              onChange={(e) => {
                setExerciseType(e.target.value as keyof typeof exercisesByType);
                setSelectedExercise('');
              }}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(exercisesByType).map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
          {sets.map((set, setIndex) => (
            <div key={setIndex} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Set {setIndex + 1}</h3>
                {sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleSetRemove(setIndex)}
                    className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Remove Set
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {set.reps.map((rep, repIndex) => (
                  <div key={repIndex} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Rep {rep.rep_number}</label>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={rep.weight}
                        onChange={(e) => handleWeightChange(setIndex, repIndex, e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      {set.reps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRepRemove(setIndex, repIndex)}
                          className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 w-full"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleRepAdd(setIndex)}
                  className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                >
                  + Add Rep
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
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
      </div>
    </form>
  );
}