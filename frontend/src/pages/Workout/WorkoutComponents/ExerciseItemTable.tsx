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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-h3 font-(--h3-font-weight) text-(length:--h3-font-size) p-3">
            Set
          </TableHead>
          <TableHead className="font-h3 font-(--h3-font-weight) text-(length:--h3-font-size) p-3">
            Reps
          </TableHead>
          <TableHead className="font-h3 font-(--h3-font-weight) text-intuitive-names-text text-(length:--h3-font-size p-3">
            Kg
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workoutData.map((workout) => (
          <TableRow key={workout.set}>
            <TableCell className="font-body font-(--body-font-weight) text-(length:--body-font-size) p-3">
              {workout.set}
            </TableCell>
            <TableCell className="font-body font-(--body-font-weight) text-(length:--body-font-size) p-3">
              {workout.reps}
            </TableCell>
            <TableCell className="font-body font-(--body-font-weight) text-(length:--body-font-size) p-3">
              {workout.kg}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
