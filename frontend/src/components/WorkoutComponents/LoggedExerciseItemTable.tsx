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
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { usePlannedWorkout } from "@/api/workouts";

// const workoutData = [
//   { set: 1, reps: 12, kg: 60 },
//   { set: 2, reps: 10, kg: 80 },
//   { set: 3, reps: 10, kg: 90 },
//   { set: 4, reps: 8, kg: 100 },
// ];

export default function WorkoutList({ exerciseId }: { exerciseId: string }) {
  const tableHeaders: string[] = [];
  const tableRows: number[][] = [];
  const plannedExercise = usePlannedWorkout(new Date()).data?.exercises.find(
    (ex) => ex.exerciseInfo.exerciseId === exerciseId
  );
  const loggedExercise = useWorkoutStore((state) =>
    state.getExercise(exerciseId)
  );

  const updateExerciseSet = useWorkoutStore((state) => state.updateExerciseSet); // needs be used like this, otherwise no reactive updates will be possible.

  // if (!loggedExercise) return;
  setTableHeadersByLogMode(tableHeaders, loggedExercise?.exerciseInfo.logMode);
  setTableRowsByLogMode(
    tableRows,
    loggedExercise?.exerciseInfo.logMode,
    loggedExercise?.sets
  );

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
          {tableRows.map((rowData: number[], rowIndex: number) => (
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
                      type="text"
                      inputMode="numeric"
                      onBeforeInput={(e) => {
                        if (!/^[0-9]$/.test(e.data)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={`${cellData}`}
                      // Bind the value to the store state
                      defaultValue={(() => {
                        const setNumber = rowData[0];
                        const set = loggedExercise?.sets.find(
                          (s) => s.setNumber === setNumber
                        );
                        if (!set) return "";

                        // Helper to get the logged value or fallback to the planned value (cellData)
                        const getValue = (
                          loggedVal: number | undefined | null
                        ) => {
                          if (loggedVal !== undefined && loggedVal !== null)
                            return loggedVal;
                          return ""; // If no logged value, return empty string so placeholder shows
                        };

                        switch (loggedExercise?.exerciseInfo.logMode) {
                          case "reps_weight":
                            return cellIndex === 1
                              ? getValue(set.actualReps)
                              : getValue(set.actualWeightKg);
                          case "reps":
                            return cellIndex === 1
                              ? getValue(set.actualReps)
                              : "";
                          case "time_weight":
                            return cellIndex === 1
                              ? getValue(set.actualTimeSeconds)
                              : getValue(set.actualWeightKg);
                          case "time":
                            return cellIndex === 1
                              ? getValue(set.actualTimeSeconds)
                              : "";
                          case "distance_weight":
                            return cellIndex === 1
                              ? getValue(set.actualDistanceMeters)
                              : getValue(set.actualWeightKg);
                          case "distance":
                            return cellIndex === 1
                              ? getValue(set.actualDistanceMeters)
                              : "";
                          default:
                            return "";
                        }
                      })()}
                      className="border-0 shadow-none focus:ring-0! p-0 placeholder:text-zinc-300 focus:text-left text-center focus:pl-4"
                      onBlur={(e) => {
                        const value = Number(e.target.value);
                        const setNumber = rowData[0];
                        if (rowIndex == 0)
                          console.log(
                            "Completed: ",
                            loggedExercise?.sets[0]?.completed
                          );

                        switch (loggedExercise?.exerciseInfo.logMode) {
                          case "reps_weight":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualReps: value,
                              });
                            if (cellIndex === 2)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualWeightKg: value,
                              });
                            break;

                          case "reps":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualReps: value,
                              });
                            break;

                          case "time_weight":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualTimeSeconds: value,
                              });
                            if (cellIndex === 2)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualWeightKg: value,
                              });
                            break;

                          case "time":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualTimeSeconds: value,
                              });
                            break;

                          case "distance_weight":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualDistanceMeters: value,
                              });
                            if (cellIndex === 2)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualWeightKg: value,
                              });
                            break;

                          case "distance":
                            if (cellIndex === 1)
                              updateExerciseSet(exerciseId, setNumber, {
                                actualDistanceMeters: value,
                              });
                            break;
                        }
                      }}
                    />
                  )}
                </TableCell>
              ))}
              <TableCell className="flex-1 body-styles pr-2! text-center">
                <Checkbox
                  checked={(() => {
                    const setNumber = rowData[0];
                    const set = loggedExercise?.sets.find(
                      (s) => s.setNumber === setNumber
                    );
                    return set?.completed ?? false;
                  })()}
                  onCheckedChange={(checked) =>
                    updateExerciseSet(exerciseId, rowData[0], {
                      completed:
                        checked === "indeterminate" ? false : Boolean(checked),
                    })
                  }
                  className="bg-300 border-text data-[state=unchecked]:text-white data-[state=checked]:bg-zinc-700 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                />
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
  if (!sets) return;
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
