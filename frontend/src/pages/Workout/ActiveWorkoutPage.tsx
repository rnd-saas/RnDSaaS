import LoggedExerciseItem from "@/components/WorkoutComponents/LoggedExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import { MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlannedWorkout } from "@/api/workouts";
import type { PlannedExercise, PlannedWorkout } from "@/lib/types/Workout";
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { useParams } from "react-router-dom";
import { formatRestTime } from "@/lib/utils/time.ts";
import { convertPlannedToLogged } from "@/lib/utils/workout";

// GENERAL NOTE: first render is test, second render is actual first render due to strict mode in dev.
// Note: the first render will have null for loggedWorkout since the workout is only started in useEffect after first render.
// that is now taken into account into table rendering etc.
export default function ActiveWorkoutPage() {
  const { id } = useParams();
  const elapsedTimeSeconds = useWorkoutStore(
    (state) => state.elapsedTimeSeconds
  );
  const isRunning = useWorkoutStore((state) => state.isRunning);
  const resetWorkout = useWorkoutStore((state) => state.resetWorkout);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const loggedWorkout = useWorkoutStore((state) => state.loggedWorkout);
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout);
  const CalculateTotalVolume = useWorkoutStore(
    (state) => state.CalculateTotalVolume
  );

  // fetch the planned workout data for today
  const { data, isLoading, error } = usePlannedWorkout(new Date()); // this or use the plannedworwkout id to fetch it?
  const plannedWorkout: PlannedWorkout | null | undefined = data;
  let workoutContentBlock;

  // Start the workout when the component mounts

  useEffect(() => {
    if (!plannedWorkout) {
      console.log("no planned workout found");
      console.error("testing the effect");
      console.error(`value of plannedwworkout: ${plannedWorkout}`);
      console.error(`value o f id param: ${id}`);
      console.error(`value of logged workout is: ${loggedWorkout}`);
      console.error(loggedWorkout);
      console.error(`value of is running: ${isRunning}`);
      return;
    }

    console.log("testing the effect");
    console.log(`value of plannedwworkout: ${plannedWorkout}`);
    console.log(`value o f id param: ${id}`);
    console.log(`value of logged workout is: ${loggedWorkout}`);
    console.log(`value of is running: ${isRunning}`);
    if (!isRunning) {
      console.log(`Planned workout is: ${plannedWorkout}`);
      console.log(`is runnign has value of: ${isRunning}`);
      // convert planned exercises to logged exercises and add to store
      if (plannedWorkout.exercises) {
        const loggedExercises = convertPlannedToLogged(
          plannedWorkout.exercises
        );

        startWorkout(id!, loggedExercises);
        updateWorkout({ exercises: loggedExercises });
      }
    }
  }, []);

  // console.log("INSIDE COMPONENT RENDER");
  // console.log(`value of plannedwworkout: ${plannedWorkout}`);
  // console.log(`value of id param: ${id}`);
  // console.log(`value of logged workout is: ${loggedWorkout}`);
  // console.log(loggedWorkout);
  console.log("testing out: ", loggedWorkout?.exercises);

  // console.log(`value of is running: ${isRunning}`);

  useEffect(() => {
    return () => {
      console.error("running clean up");
      resetWorkout();
    };
  }, []);

  // handle different states: loading, error, no workout, display workout
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
        {plannedWorkout.exercises.map((plannedExercise: PlannedExercise) => (
          <LoggedExerciseItem
            key={plannedExercise.exerciseId}
            plannedExerciseId={plannedExercise.exerciseInfo.exerciseId}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-(--basic-colours-zinc-50)">
      <div className="flex-1 flex flex-col gap-[30px] items-center">
        <div className="sticky top-0 z-20 w-full bg-(--basic-colours-zinc-50)/95 backdrop-blur supports-[backdrop-filter]:bg-(--basic-colours-zinc-50)/80">
          <div className="flex flex-col gap-2 lg:gap-2 items-center mt-2 min-w-[60%]">
            <h3 className="h3-styles text-base font-bold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
            <div className="max-w-[728px] w-4/5 flex justify-bewteem items-center gap-5 md:gap-0 md:justify-evenly mb-2">
              <div>
                <span className="text-zinc-700 block font-primary text-sm">
                  Duration:
                </span>
                <span className="text-yellow-600 block text-base font-bold">
                  {formatRestTime(elapsedTimeSeconds)}
                </span>
              </div>
              <div>
                <span className="text-zinc-700 block font-primary text-sm">
                  Volume:
                </span>
                <span className="text-zinc-400 block text-base ">
                  {CalculateTotalVolume()}
                </span>
              </div>
              <div>
                <span className="text-zinc-700 block font-primary text-sm">
                  Sets Finished:
                </span>
                <span className="text-zinc-400 block text-base ">2</span>
              </div>
            </div>
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
