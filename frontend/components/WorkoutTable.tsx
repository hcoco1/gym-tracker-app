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
