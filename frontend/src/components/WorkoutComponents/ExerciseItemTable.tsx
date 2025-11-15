import { Card, CardContent } from "@/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { ChevronUp, HelpCircle } from "lucide-react";
import React from "react";

const workoutData = [
  { set: 1, reps: 12, kg: 60 },
  { set: 2, reps: 10, kg: 80 },
  { set: 3, reps: 10, kg: 90 },
  { set: 4, reps: 8, kg: 100 },
];

export default function WorkoutList() {
  return (
    <>
      <Table className="mb-2 [&_td]:text-base [&_th]:h3-styles [&_th]:border-b-1 [&_th]:border-zinc-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 text-center h3-styles p-3">
              Set
            </TableHead>
            <TableHead className="w-1/3 text-center h3-styles p-3">
              Reps
            </TableHead>
            <TableHead className="w-1/3 text-center font-(family-name:--h3-font-family) font-(--h3-font-weight) text-intuitive-names-text text-(length:--h3-font-size) p-3">
              Kg
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workoutData.map((workout) => (
            <TableRow key={workout.set}>
              <TableCell className="w-1/3 font-body p-3 text-center">
                {workout.set}
              </TableCell>
              <TableCell className="w-1/3 font-body text-center p-3 ">
                {workout.reps}
              </TableCell>
              <TableCell className="w-1/3 font-body text-center p-3 ">
                {workout.kg}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
