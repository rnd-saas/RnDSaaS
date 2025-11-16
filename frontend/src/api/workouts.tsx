import { dummyPlannedWorkout } from "@/lib/data/dummyPlannedWorkout";
import { PlannedWorkout } from "@/lib/types/Workout";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Simulated API call to fetch planned workout for a specific date and user
 * @param date
 * @param userId
 * @return promise resolving to PlannedWorkout type
 */
async function fetchPlannedWorkout(
  date: Date,
  userId: string
): Promise<PlannedWorkout> {
  // Simulate network delay
  await new Promise<PlannedWorkout>((resolve) => setTimeout(resolve, 500));

  // In a real implementation, you would fetch data from a backend service here
  // For now, we return the dummy data regardless of date and userId
  return dummyPlannedWorkout;
}

export function usePlannedWorkout(date: Date, userId: string) {
  return useQuery<PlannedWorkout>({
    queryKey: ["plannedWorkout", date],
    queryFn: () => fetchPlannedWorkout(date, userId),
  });
}
