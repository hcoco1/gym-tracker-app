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
}

interface SetData {
  reps: RepData[];
}

export default function WorkoutForm() {
  const [exerciseType, setExerciseType] = useState<keyof typeof exercisesByType>('push');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState<SetData[]>([{ reps: [{ weight: '' }] }]);
  const { addWorkout } = useWorkoutStore();

  const handleSetAdd = () => {
    setSets(prev => [...prev, { reps: [{ weight: '' }] }]);
  };

  const handleRepAdd = (setIndex: number) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[setIndex].reps.push({ weight: '' });
      return newSets;
    });
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
    
    try {
      const response = await axios.post('http://localhost:8000/workouts/', {
        exercise: selectedExercise,
        exercise_type: exerciseType,
        sets: sets.map((set, setIndex) => ({
          set_number: setIndex + 1,
          reps: set.reps.map((rep, repIndex) => ({
            rep_number: repIndex + 1,
            weight: parseFloat(rep.weight) || 0
          }))
        }))
      });

      addWorkout(response.data);
      setSets([{ reps: [{ weight: '' }] }]);
      setSelectedExercise('');
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Log New Workout</h2>
      
      <div className="space-y-4">
        {/* Exercise Selection */}
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
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
              <option value="core">Core</option>
              <option value="cardio">Cardio</option>
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

        {/* Sets and Reps */}
        <div className="space-y-6">
          {sets.map((set, setIndex) => (
            <div key={setIndex} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Set {setIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRepAdd(setIndex)}
                  className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Add Rep +
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {set.reps.map((rep, repIndex) => (
                  <div key={repIndex} className="space-y-1">
                    <label className="text-sm text-gray-600">Rep {repIndex + 1} Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rep.weight}
                      onChange={(e) => handleWeightChange(setIndex, repIndex, e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
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