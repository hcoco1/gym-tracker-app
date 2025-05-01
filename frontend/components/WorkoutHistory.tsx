import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';

interface Workout {
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
}

export default function WorkoutTable({ workouts }: WorkoutTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<Workout>[] = [
    {
      header: 'Date',
      accessorFn: (row) => format(new Date(row.created_at), 'MMM dd, yyyy - HH:mm'),
    },
    {
      header: 'Exercise',
      accessorKey: 'exercise',
    },
    {
      header: 'Type',
      accessorKey: 'exercise_type',
      cell: (info) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs capitalize">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: 'Sets & Weights',
      accessorFn: (row) =>
        row.sets
          .map(
            (set) =>
              `Set ${set.set_number}: ${set.reps
                .map((rep) => `${rep.weight}kg`)
                .join(', ')}`
          )
          .join(' | '),
    },
  ];

  const table = useReactTable({
    data: workouts,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search workouts..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 border rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 font-medium text-gray-600 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-2 text-sm text-gray-700">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
