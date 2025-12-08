import LoggedExerciseItem from "@/components/WorkoutComponents/LoggedExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import {
  MessageSquareMore,
  MoreVertical,
  Pause,
  X,
  Play,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePlannedWorkout, useSubmitWorkout } from "@/api/workouts";
import type { PlannedExercise, PlannedWorkout } from "@/lib/types/Workout";
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { useParams, useNavigate } from "react-router-dom";
import { formatRestTime } from "@/lib/utils/time";
import { convertPlannedToLogged } from "@/lib/utils/workout";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import { toast } from "sonner";

// GENERAL NOTE: first render is test, second render is actual first render due to strict mode in dev.
// Note: the first render will have null for loggedWorkout since the workout is only started in useEffect after first render.
// that is now taken into account into table rendering etc.
export default function ActiveWorkoutPage() {
  const { id } = useParams();
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const elapsedTimeSeconds = useWorkoutStore(
    (state) => state.elapsedTimeSeconds
  );
  const isRunning = useWorkoutStore((state) => state.isRunning);
  const resetWorkout = useWorkoutStore((state) => state.resetWorkout);
  const pauseWorkout = useWorkoutStore((state) => state.pauseWorkout);
  const resumeWorkout = useWorkoutStore((state) => state.resumeWorkout);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const loggedWorkout = useWorkoutStore((state) => state.loggedWorkout);
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout);
  const navigate = useNavigate();
  const calculateTotalVolume = useWorkoutStore(
    (state) => state.calculateTotalVolume
  );
  const calculateTotalSetsFinished = useWorkoutStore(
    (state) => state.calculateTotalSetsFinished
  );

  const { mutate: submitWorkout, isPending: isSubmitting } = useSubmitWorkout();

  const onFinishConfirmed = () => {
    if (!loggedWorkout) return;

    submitWorkout(loggedWorkout, {
      onSuccess: (data) => {
        // Check for achievements
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach((achievement ) => {
            toast.success(`Achievement Unlocked: ${achievement.name}!`, {
              description: achievement.description,
              duration: 5000,
              icon: achievement.icon || "🏆",
            });
          });
        }

        // data is the created workout object from backend, containing the new ID
        navigate(`/workout/${id}/evaluation`, { 
          replace: true,
          state: { workoutId: data.id } 
        });
      },
      onError: (error) => {
        console.error("Failed to submit workout", error);
        // Handle error (maybe show toast)
        toast.error("Failed to save workout. Please try again.");
      }
    });
  };

  const handleFinishWorkout = () => {
    if (!loggedWorkout?.exercises) {
      // If no exercises, maybe just navigate or show error?
      // Assuming we still want to finish even if empty?
      onFinishConfirmed();
      return;
    }

    const allSetsCompleted = loggedWorkout.exercises.every((exercise) =>
      exercise.sets.every((set) => set.completed)
    );

    if (allSetsCompleted) {
      onFinishConfirmed();
    } else {
      setIsFinishDialogOpen(true);
    }
  };

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
      // Safety Check: If we already have a logged workout for this ID, don't overwrite it!
      if (loggedWorkout && loggedWorkout.workoutId === id) {
        console.log("Resuming existing paused session. Data preserved.");
        return;
      }

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
      // resetWorkout();
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
    <div className="w-full min-h-screen flex flex-col bg-zinc-50">
      <div className="flex-1 flex flex-col gap-[30px] items-center">
        <div className="sticky top-0 z-20 w-full bg-zinc-50/95 backdrop-blur supports-backdrop-filter:bg-zinc-50/80">
          <div className="relative flex items-center justify-center p-4">
            <div className="absolute left-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-zinc-100"
                onClick={() => {
                  if (isRunning) pauseWorkout();
                  navigate("../workout");
                }}
              >
                <ChevronLeft className="h-6 w-6 text-zinc-700" />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="h3-styles text-base font-bold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </h3>
            </div>
            <div className="absolute right-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                  >
                    <MoreVertical className="h-6 w-6 text-zinc-700" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-1">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        if (isRunning) {
                          pauseWorkout();
                        } else {
                          resumeWorkout();
                        }
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-zinc-100 focus:bg-zinc-100"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="h-4 w-4" />
                          <span>Pause Workout</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Resume Workout</span>
                        </>
                      )}
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-zinc-100 focus:bg-zinc-100">
                          <X className="h-4 w-4" />
                          <span>Quit Workout</span>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Quit Workout?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to quit? Your current progress
                            will be lost.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              resetWorkout();
                              navigate("/workout");
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Quit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:gap-2 items-center mt-2 min-w-[60%]">
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
                  {calculateTotalVolume()}
                </span>
              </div>
              <div>
                <span className="text-zinc-700 block font-primary text-sm">
                  Sets Finished:
                </span>
                <span className="text-zinc-400 block text-base ">
                  {calculateTotalSetsFinished()}
                </span>
              </div>
            </div>
          </div>
        </div>
        {workoutContentBlock}
      </div>
      <div className="sticky bottom-6 mt-9 w-full bg-background/50 flex justify-center">
        <div className="mx-auto w-4/5 flex items-center justify-center gap-4 max-w-[728px]">
          {isRunning ? (
            <>
              <Button
                variant="secondary"
                className="flex-1 text-md "
                onClick={handleFinishWorkout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Finish Workout"}
              </Button>
              <AlertDialog
                open={isFinishDialogOpen}
                onOpenChange={setIsFinishDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finish Workout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You haven't completed all sets. Are you sure you want to
                      finish?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onFinishConfirmed}
                    >
                      Finish
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button
              variant="default"
              className="flex-1 text-md bg-green-500 hover:bg-green-600 text-white"
              onClick={() => resumeWorkout()}
            >
              Resume Workout
            </Button>
          )}
          <Button
            size={"icon"}
            variant={isRunning ? "secondary" : "default"}
            className=""
            onClick={() => navigate("/chatbot")}
          >
            <MessageSquareMore size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
