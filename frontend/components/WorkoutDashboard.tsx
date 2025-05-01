// components/WorkoutDashboard.tsx
import { Workout } from '../types/workout';
import WorkoutForm from './WorkoutForm';

import WorkoutListCard from './WorkoutListCard';

interface WorkoutDashboardProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export default function WorkoutDashboard({ workouts, onDelete }: WorkoutDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <WorkoutForm />
      </div>

      <div className="lg:col-span-2 space-y-6">
        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow p-6">
   
        </div>
        
        {/* Mobile Cards */}
        <div className="lg:hidden bg-white rounded-lg shadow p-4">
          <WorkoutListCard workouts={workouts} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}