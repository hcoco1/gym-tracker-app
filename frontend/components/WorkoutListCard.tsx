// components/WorkoutListCard.tsx
import { Workout } from '../types/workout'; // Ensure this type is properly defined

interface WorkoutListCardProps {
  workout: Workout;  // Singular
  onDelete: (id: number) => Promise<void>;
}

const WorkoutListCard = ({ workout, onDelete }: WorkoutListCardProps) => {
  // Add null check guard
  if (!workout) {
    return (
      <div className="p-4 border rounded-lg mb-4 bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">
          {workout.exercise || "Unknown Exercise"}
        </h3>
        <span className="text-sm text-gray-500 capitalize">
          {workout.exercise_type || "N/A"}
        </span>
      </div>

      <div className="space-y-2">
        {workout.sets?.map((set, index) => (
          <div 
            key={set?.set_number || index} 
            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
          >
            <span>Set {set?.set_number || index + 1}</span>
            <div className="space-x-4">
              <span>Weight: {set?.weight ?? "N/A"} kg</span>
              <span>Reps: {set?.reps ?? "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutListCard;