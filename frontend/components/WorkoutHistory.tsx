import { format } from 'date-fns';

interface WorkoutHistoryProps {
  workouts: Array<{
    id: number;
    exercise: string;
    exercise_type: string;
    created_at: string;
    sets: Array<{
      set_number: number;
      reps: Array<{
        rep_number: number;
        weight: number;
      }>; 
    }>;
  }>;
}

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <div key={workout.id} className="rounded-lg shadow-sm bg-white p-4 border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {workout.exercise}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(workout.created_at), 'MMM dd, yyyy - HH:mm')}
              </p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
              {workout.exercise_type}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            {workout.sets.map((set) => (
              <div key={set.set_number} className="mb-2">
                <span className="font-medium">Set {set.set_number}:</span>{" "}
                {set.reps.map((rep, index) => (
                  <span key={index}>
                    {rep.weight}kg{index !== set.reps.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
