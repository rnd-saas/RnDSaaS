import type { PlannedExercise, LoggedExercise } from "@/lib/types/Workout";

/**
 *  Converts an array of PlannedExercise to LoggedExercise format.
 * @param planned
 * @returns
 */
export function convertPlannedToLogged(
  planned: PlannedExercise[]
): LoggedExercise[] {
  const plannedConverted: LoggedExercise[] = planned;

  const test = plannedConverted.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set, completed: false })),
  }));
  return test;
}
