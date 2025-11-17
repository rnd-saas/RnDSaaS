import { dummyPlannedWorkouts } from "@/lib/data/dummyPlannedWorkout";
import type { PlannedWorkout } from "@/lib/types/Workout";
import { useQuery } from "@tanstack/react-query";

/**
 * Simulated API call to fetch planned workout for a specific date and user
 * @param date
 * @return promise resolving to PlannedWorkout type
 */
async function fetchPlannedWorkout(date: Date): Promise<PlannedWorkout> {
  // Simulate network delay
  await new Promise<PlannedWorkout>((resolve) => setTimeout(resolve, 500));

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
