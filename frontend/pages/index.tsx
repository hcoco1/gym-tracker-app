// pages/index.tsx
import { useEffect } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutListCard from '../components/WorkoutListCard';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Home() {
  const { workouts, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/workouts/${id}`);
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WorkoutForm />
          </div>
          <div className="lg:col-span-2">
          // Parent component (correct)
{workouts.map((workout) => (
  <WorkoutListCard 
    key={workout.id} 
    workout={workout} 
    onDelete={handleDelete} 
  />
))}
          </div>
        </div>
      </main>
    </div>
  );
}