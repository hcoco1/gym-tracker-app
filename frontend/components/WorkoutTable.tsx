'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

export interface Workout {
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
}

interface WorkoutTableProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export default function WorkoutTable({ workouts, onDelete }: WorkoutTableProps) {
  const columns = useMemo<ColumnDef<Workout>[]>(
    () => [
      {
        header: 'Exercise',
        accessorKey: 'exercise',
      },
      {
        header: 'Type',
        accessorKey: 'exercise_type',
        cell: (info) => (info.getValue() as string)?.toUpperCase(),
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      {
        header: 'Sets',
        accessorFn: (row) => row.sets?.length || 0,
      },
      {
        header: 'Reps',
        accessorFn: (row) =>
          row.sets?.reduce((total, set) => total + (set.reps?.length || 0), 0) || 0,
      },
      {
        header: 'Weights (kg)',
        cell: ({ row }) => {
          const weights = row.original.sets.flatMap(set => 
            set.reps.map(rep => rep.weight)
          );
          const uniqueWeights = [...new Set(weights)];
          
          return (
            <div className="flex flex-wrap gap-1">
              {uniqueWeights.map((weight, i) => (
                <span 
                  key={i} 
                  className="bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  {weight}kg
                </span>
              ))}
            </div>
          );
        },
      },
      {
        header: 'Set Details',
        cell: ({ row }) => (
          <div className="space-y-1">
            {row.original.sets.map((set) => (
              <div key={set.set_number} className="text-xs">
                Set {set.set_number}:{' '}
                {set.reps.map((rep, i) => (
                  <span key={i}>
                    {rep.weight}kg{rep.rep_number < set.reps.length ? ', ' : ''}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <button
            className="text-red-500 hover:underline"
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </button>
        ),
      },
    ],
    [onDelete]
  );

  const table = useReactTable({
    data: workouts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 border-b font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}