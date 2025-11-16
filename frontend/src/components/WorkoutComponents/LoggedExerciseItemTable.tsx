import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import type { TargetSet, ExerciseInformation } from "@/lib/types/Workout";

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

  return (
    <>
      <Table className="mb-2 [&_td]:body-styles [&_td]:text-sm md:[&_td]:text-base lg:[&_td]:text-sm [&_th]:text-base lg:[&_th]:text-base md:[&_th]:text-lg [&_th]:border-b-1 [&_th]:border-zinc-200">
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header: string) => (
              <TableHead
                key={header}
                className="w-1/3  h3-styles h-auto pb-0.5 text-[var(--basic-colours-zinc-700)]"
              >
                {header}
              </TableHead>
            ))}
            <TableHead>Extra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.map((rowData: number[]) => (
            <TableRow key={`${rowData[0]}-${rowData.join("-")}`}>
              {rowData.map((cellData: number, cellIndex: number) => (
                <TableCell
                  key={`${rowData[0]}-${cellIndex}`}
                  className="w-1/3 body-styles"
                >
                  {cellData}
                </TableCell>
              ))}
              <TableCell className="w-1/3 body-styles text-center">
                test
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
