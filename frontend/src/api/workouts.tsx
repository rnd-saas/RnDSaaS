import {
  dummyPlannedWorkouts,
  dummyExercise,
} from "@/lib/data/dummyPlannedWorkout";
import type {
  PlannedWorkout,
  ExerciseInformation,
  WorkoutEvaluation,
} from "@/lib/types/Workout";
import { useQuery, useMutation } from "@tanstack/react-query";

/**
 * Simulated API call to fetch planned workout for a specific date and user
 * @param date
 * @return promise resolving to PlannedWorkout type
 */
async function fetchPlannedWorkout(date: Date): Promise<PlannedWorkout | null> {
  // Simulate network delay
  await new Promise<PlannedWorkout | null>((resolve) =>
    setTimeout(resolve, 500)
  );

  // In a real implementation, you would fetch data from a backend service here
  // For now, we return the dummy data regardless of date and userId
  return (
    dummyPlannedWorkouts.find(
      (plannedWorkout) =>
        plannedWorkout.date.toDateString() === date.toDateString()
    ) ?? null
  );
}

export function usePlannedWorkout(date: Date) {
  return useQuery<PlannedWorkout | null>({
    queryKey: ["plannedWorkout", date.toDateString()],
    queryFn: () => fetchPlannedWorkout(date),
    gcTime: 60000,
  });
}

async function fetchExercise(exerciseSlug: string) {
  await new Promise<ExerciseInformation>((resolve) => setTimeout(resolve, 500));

  // In a real implementation, you would fetch data from a backend service here
  // For now, we return a dummy exercise based on the slug
  return dummyExercise;
}

export function useExercise(exerciseSlug: string) {
  return useQuery<ExerciseInformation | null>({
    queryKey: ["exercise", exerciseSlug],
    queryFn: () => fetchExercise(exerciseSlug),
    gcTime: 60000, // will be garbage collected after 1 minute of inactivity
  });
}

/**
 * Simulated API call to save workout evaluation
 */
async function saveWorkoutEvaluation(
  evaluation: WorkoutEvaluation
): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Saved evaluation:", evaluation);
  // In a real implementation, you would POST data to a backend service here
}

export function useSaveWorkoutEvaluation() {
  return useMutation({
    mutationFn: saveWorkoutEvaluation,
  });
}
