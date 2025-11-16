import LoggedExerciseItem from "@/components/WorkoutComponents/LoggedExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import { MessageSquareMore } from "lucide-react";
import { useState } from "react";
import { usePlannedWorkout } from "@/api/workouts";
import type { PlannedExercise, PlannedWorkout } from "@/lib/types/Workout";

export default function ActiveWorkoutPage() {
  const { data, isLoading, error } = usePlannedWorkout(new Date(), "user_123");

  const plannedWorkout: PlannedWorkout | undefined = data;
  let workoutContentBlock;

  if (isLoading) {
    workoutContentBlock = <div className="p-4 text-sm">Loading workout...</div>;
  } else if (error) {
    workoutContentBlock = (
      <div className="p-4 text-sm text-red-600">Failed to load workout.</div>
    );
  } else if (!plannedWorkout || !plannedWorkout.exercises?.length) {
    workoutContentBlock = (
      <div className="p-4 text-sm text-muted-foreground">
        No workout planned for this day.
      </div>
    );
  } else {
    workoutContentBlock = (
      <div className="flex flex-col items-center justify-start flex-1 gap-5 md:gap-[30px] w-full">
        {plannedWorkout.exercises.map((exercise: PlannedExercise) => (
          <LoggedExerciseItem key={exercise.exerciseId} exercise={exercise} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-(--basic-colours-zinc-50)">
      <div className="flex-1 flex flex-col gap-[30px] items-center">
        <div className="sticky top-0 z-20 w-full bg-(--basic-colours-zinc-50)/95 backdrop-blur supports-[backdrop-filter]:bg-(--basic-colours-zinc-50)/80">
          <div className="flex flex-col gap-2 lg:gap-0 items-center mt-4 min-w-[60%]">
            <h3 className="h3-styles text-base font-bold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
          </div>
        </div>
        {workoutContentBlock}
      </div>
      <div className="sticky bottom-0 w-full bg-background/50 py-4 flex justify-center">
        <div className="mx-auto w-4/5 flex items-center justify-center gap-4 max-w-[728px]">
          <Button variant="secondary" className="flex-1 text-md ">
            Finish Workout
          </Button>
          <Button size={"icon"} variant="secondary" className="lg:h-9">
            <MessageSquareMore size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
