// components/WorkoutListCard.tsx
import { Workout } from './WorkoutTable';

interface WorkoutListCardProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export default function WorkoutListCard({ workouts, onDelete }: WorkoutListCardProps) {
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
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

          <div className="mt-3 space-y-2">
            {workout.sets.map((set) => (
              <div key={set.set_number} className="flex justify-between text-sm">
                <span>Set {set.set_number}:</span>
                <span className="font-medium">
                  {set.reps.length} reps × {set.reps[0]?.weight || 0}kg
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
      ))}
    </div>
  );
}