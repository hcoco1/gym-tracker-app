import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Workout } from '../types/types';

import { useMemo } from "react";

interface WorkoutTableProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export default function WorkoutTable({ workouts, onDelete }: WorkoutTableProps) {
  const columns = useMemo<ColumnDef<Workout>[]>(
    () => [
      {
        header: "Exercise",
        accessorKey: "exercise",
      },
      {
        header: "Type",
        accessorKey: "exercise_type",
        cell: ({ row }) => (
          <span className="uppercase text-sm text-blue-600">
            {row.original.exercise_type}
          </span>
        ),
      },
      {
        header: "Date",
        accessorKey: "created_at",
        cell: ({ row }) =>
          format(new Date(row.original.created_at), "MMM dd, yyyy HH:mm"),
      },
      {
        header: "Sets",
        accessorKey: "sets",
        cell: ({ row }) => row.original.sets?.length || 0,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => onDelete(row.original.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
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
      <table className="min-w-full bg-white shadow rounded-lg text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4 py-2 font-medium text-gray-600"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-gray-800">
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
