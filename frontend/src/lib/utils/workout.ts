import type { PlannedExercise, LoggedExercise } from "@/lib/types/Workout";

/**
 *  Converts an array of PlannedExercise to LoggedExercise format.
 * @param planned
 * @returns
 */
export function convertPlannedToLogged(
  planned: PlannedExercise[]
): LoggedExercise[] {
  return planned.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({
      ...set, // Keep target values (targetReps, etc.) for autofill logic
      setNumber: set.setNumber,
      completed: false,
      actualReps: undefined,
      actualWeightKg: undefined,
      actualTimeSeconds: undefined,
      actualDistanceMeters: undefined,
      actualHeightCm: undefined
    })),
  }));
}
