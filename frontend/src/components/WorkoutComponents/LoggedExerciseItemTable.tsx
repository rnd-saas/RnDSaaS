import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import type { TargetSet, ExerciseInformation } from "@/lib/types/Workout";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

// const workoutData = [
//   { set: 1, reps: 12, kg: 60 },
//   { set: 2, reps: 10, kg: 80 },
//   { set: 3, reps: 10, kg: 90 },
//   { set: 4, reps: 8, kg: 100 },
// ];

export default function WorkoutList({
  sets,
  logMode,
}: {
  sets: TargetSet[];
  logMode: ExerciseInformation["logMode"];
}) {
  const tableHeaders: string[] = [];
  const tableRows: number[][] = [];

  setTableHeadersByLogMode(tableHeaders, logMode);
  setTableRowsByLogMode(tableRows, logMode, sets);
  const headerCount = tableHeaders.length;

  return (
    <>
      <Table className="mb-2 [&_td]:body-styles [&_td]:text-sm md:[&_td]:text-base lg:[&_td]:text-sm [&_th]:text-base lg:[&_th]:text-base md:[&_th]:text-lg">
        <TableHeader>
          <TableRow className="flex items-center justify-center border-zinc-300! hover:bg-yellow-50">
            {tableHeaders.map((header: string, idx: number) => (
              <TableHead
                key={header}
                className={`${
                  idx == 0 ? "flex-1" : "flex-1 text-center"
                } h3-styles h-auto text-zinc-700 text-center`}
              >
                {header}
              </TableHead>
            ))}
            <TableHead className="flex-1 h3-styles h-auto text-zinc-700 pt-2 pb-2 flex items-center justify-center">
              <Check color="#52525C" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.map((rowData: number[]) => (
            <TableRow
              key={`${rowData[0]}-${rowData.join("-")}`}
              className="flex items-center justify-center hover:bg-yellow-50"
            >
              {rowData.map((cellData: number, cellIndex: number) => (
                <TableCell
                  key={`${rowData[0]}-${cellIndex}`}
                  className={`${
                    cellIndex == 0 ? "flex-1" : "flex-1"
                  } body-styles text-zinc-700 focus:text-left text-center transition-all duration-150 ease-in-out 
    !pl-3 focus-within:!pl-2`}
                >
                  {cellIndex == 0 ? (
                    cellData
                  ) : (
                    <Input
                      type="number"
                      placeholder={`${cellData}`}
                      className="border-0 shadow-none focus:ring-0! p-0 placeholder:text-zinc-300 focus:text-left text-center focus:pl-4"
                    />
                  )}
                </TableCell>
              ))}
              <TableCell className="flex-1 body-styles pr-2! text-center">
                <Checkbox className="bg-300 border-text data-[state=unchecked]:text-white data-[state=checked]:bg-zinc-700 data-[state=checked]:border-green-500 data-[state=checked]:text-white" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

/**
 * Helper function to  set up table headers by log mode
 */
function setTableHeadersByLogMode(
  tableHeaders: string[],
  logMode: ExerciseInformation["logMode"]
) {
  if (logMode === "reps_weight") tableHeaders.push("Set", "Reps", "Kg");
  else if (logMode === "reps") tableHeaders.push("Set", "Reps");
  else if (logMode === "time_weight")
    tableHeaders.push("Set", "Time (s)", "Kg");
  else if (logMode === "time") tableHeaders.push("Set", "Time (s)");
  else if (logMode === "distance_weight")
    tableHeaders.push("Set", "Distance (m)", "Kg");
  else if (logMode === "distance") tableHeaders.push("Set", "Distance (m)");

  return tableHeaders;
}

/**
 * Helper function to populate table rows with target set attributes
 */
function setTableRowsByLogMode(
  tableRows: number[][],
  logMode: ExerciseInformation["logMode"],
  sets: TargetSet[]
) {
  for (const set of sets) {
    if (logMode === "reps_weight")
      tableRows.push([set.setNumber, set.targetReps!, set.targetWeightKg!]);
    else if (logMode === "reps")
      tableRows.push([set.setNumber, set.targetReps!]);
    else if (logMode === "time_weight")
      tableRows.push([
        set.setNumber,
        set.targetTimeSeconds!,
        set.targetWeightKg!,
      ]);
    else if (logMode === "time")
      tableRows.push([set.setNumber, set.targetTimeSeconds!]);
    else if (logMode === "distance_weight")
      tableRows.push([
        set.setNumber,
        set.targetDistanceMeters!,
        set.targetWeightKg!,
      ]);
    else if (logMode === "distance")
      tableRows.push([set.setNumber, set.targetDistanceMeters!]);
  }

  return tableRows;
}
