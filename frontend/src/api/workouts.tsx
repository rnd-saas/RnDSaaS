import type {
  PlannedWorkout,
  ExerciseInformation,
  WorkoutEvaluation,
  LoggedWorkout,
} from "@/lib/types/Workout";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import { workoutService } from "@/lib/api/workoutService";

/**
 * API call to fetch planned workout for a specific date and user
 * @param date
 * @return promise resolving to PlannedWorkout type
 */
async function fetchPlannedWorkout(date: Date): Promise<PlannedWorkout | null> {
  return await workoutService.getPlannedWorkout(date);
}

export function usePlannedWorkout(date: Date) {
  return useQuery<PlannedWorkout | null>({
    queryKey: ["plannedWorkout", date.toDateString()],
    queryFn: () => fetchPlannedWorkout(date),
    gcTime: 60000,
  });
}

async function fetchExercise(exerciseSlug: string) {
  return await workoutService.getExerciseBySlug(exerciseSlug);
}

export function useExercise(exerciseSlug: string) {
  return useQuery<ExerciseInformation | null>({
    queryKey: ["exercise", exerciseSlug],
    queryFn: () => fetchExercise(exerciseSlug),
    gcTime: 60000, // will be garbage collected after 1 minute of inactivity
  });
}

/**
 * API call to save completed workout data (without evaluation)
 */
async function submitWorkout(loggedWorkout: LoggedWorkout): Promise<any> {
  // Prepare data for backend
  const payload = {
    planId: loggedWorkout.workoutId,
    startedAt: loggedWorkout.startDatetime,
    endedAt: new Date(), // Now
    durationSeconds: Math.floor(
      (new Date().getTime() - new Date(loggedWorkout.startDatetime).getTime()) /
        1000
    ),
    exercises: loggedWorkout.exercises,
  };

  return await workoutService.saveCompletedWorkout(payload);
}

export function useSubmitWorkout() {
  return useMutation({
    mutationFn: submitWorkout,
  });
}

/**
 * API call to update workout evaluation
 */
async function updateWorkoutEvaluation(data: {
  workoutId: string;
  evaluation: WorkoutEvaluation;
}): Promise<void> {
  const { workoutId, evaluation } = data;
  await workoutService.updateWorkoutEvaluation(workoutId, evaluation);
}

export function useUpdateWorkoutEvaluation() {
  return useMutation({
    mutationFn: updateWorkoutEvaluation,
  });
}

/**
 * API call to get AI feedback
 */
async function fetchAiFeedback(workoutId: string): Promise<string> {
  const response = await workoutService.getAiFeedback(workoutId);
  return response.feedback;
}

export function useAiFeedback(workoutId: string | undefined) {
  return useQuery({
    queryKey: ["aiFeedback", workoutId],
    queryFn: () => fetchAiFeedback(workoutId!),
    enabled: !!workoutId,
    staleTime: Infinity, // Feedback shouldn't change for a completed workout
  });
}

export function useNextPlannedWorkout(startDate: Date, daysToLookAhead: number = 7) {
  const dates = Array.from({ length: daysToLookAhead }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d;
  });

  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: ["plannedWorkout", date.toDateString()],
      queryFn: () => fetchPlannedWorkout(date),
      gcTime: 60000,
    })),
  });

  // Find the first successful query with data (non-null workoutId means a plan exists)
  const nextWorkout = queries.find((q) => q.data && q.data.workoutId)?.data ?? null;
  
  const upcomingWorkouts = queries.map((q, index) => ({
    date: dates[index],
    workout: q.data ?? null,
    isLoading: q.isLoading
  }));

  const isLoading = queries.some((q) => q.isLoading);

  return { nextWorkout, upcomingWorkouts, isLoading };
}
