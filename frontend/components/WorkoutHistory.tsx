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
    <div className="space-y-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{workout.exercise}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(workout.created_at), 'MMM dd, yyyy - HH:mm')}
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
                {workout.exercise_type.charAt(0).toUpperCase() + workout.exercise_type.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {workout.sets.map((set) => (
              <div key={set.set_number} className="border-l-4 border-blue-200 pl-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Set {set.set_number}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {set.reps.map((rep) => (
                    <div key={rep.rep_number} className="text-sm">
                      <span className="text-gray-600">Rep {rep.rep_number}:</span>{' '}
                      <span className="font-medium text-gray-800">
                        {rep.weight} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}