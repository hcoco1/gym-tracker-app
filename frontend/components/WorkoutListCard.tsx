// components/WorkoutListCard.tsx
import { Workout } from '../types/workout';

interface WorkoutListCardProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export default function WorkoutListCard({ workouts, onDelete }: WorkoutListCardProps) {
  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const totalVolume = workout.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
        const totalSets = workout.sets.length;
        const totalReps = workout.sets.reduce((sum, set) => sum + set.reps, 0);

        return (
          <div key={workout.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{workout.exercise}</h3>
                <p className="text-gray-500 text-sm capitalize">{workout.exercise_type}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(workout.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Sets</p>
                <p className="font-bold">{totalSets}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Reps</p>
                <p className="font-bold">{totalReps}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Volume</p>
                <p className="font-bold">{totalVolume.toFixed(1)}kg</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {workout.sets.map((set) => (
                <div key={set.set_number} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Set {set.set_number}</span>
                  <span>
                    {set.reps} × {set.weight}kg
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onDelete(workout.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}