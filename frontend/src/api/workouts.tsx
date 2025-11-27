import {
  dummyPlannedWorkouts,
  dummyExercise,
} from "@/lib/data/dummyPlannedWorkout";
import type { PlannedWorkout, ExerciseInformation } from "@/lib/types/Workout";
import { useQuery } from "@tanstack/react-query";

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
