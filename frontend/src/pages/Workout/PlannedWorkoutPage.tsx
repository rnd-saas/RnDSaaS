import PlannedExerciseItem from "@/components/WorkoutComponents/PlannedExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import { MessageSquareMore } from "lucide-react";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/shadcn-io/mini-calendar";
import { useState } from "react";
import { startOfWeek } from "date-fns";
import { usePlannedWorkout } from "@/api/workouts";
import type { PlannedExercise, PlannedWorkout } from "@/lib/types/Workout";
import { useNavigate } from "react-router-dom";

export default function WorkoutPage() {
  const isLarge = window.matchMedia("(min-width: 1024px)").matches;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading, error } = usePlannedWorkout(selectedDate);
  const navigate = useNavigate();

  const plannedWorkout: PlannedWorkout | null = data;
  // Store today's ID for when user clicks on "Start Workout"
  const [todayWorkoutId, setTodayWorkoutId] = useState<string | null>(null);
  if (
    !todayWorkoutId &&
    plannedWorkout &&
    plannedWorkout.date.toDateString() === new Date().toDateString()
  ) {
    setTodayWorkoutId(plannedWorkout.workoutId);
  }

  const handleWorkoutStart = () => {
    navigate(`/workout/${todayWorkoutId}`);
  };

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
          <PlannedExerciseItem key={exercise.exercise_id} exercise={exercise} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-(--basic-colours-zinc-50)">
      <div className="flex-1 flex flex-col gap-[30px] items-center pb-18">
        <div className="sticky top-0 z-20 w-full bg-(--basic-colours-zinc-50)/95 backdrop-blur supports-[backdrop-filter]:bg-(--basic-colours-zinc-50)/80">
          <div className="flex flex-col gap-2 lg:gap-0 items-center mt-4 min-w-[60%]">
            <h3 className="h3-styles text-base font-bold">
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
            <MiniCalendar
              className="border-0 bg-background my-0 md:p-4 lg:py-1 py-2"
              onValueChange={setSelectedDate}
              value={selectedDate}
              defaultStartDate={startOfWeek(selectedDate!, { weekStartsOn: 1 })}
              days={7}
            >
              {/* note: if you need manage state of startDate too, add the state here! */}
              <MiniCalendarNavigation direction="prev" />
              <MiniCalendarDays>
                {(date) => (
                  <MiniCalendarDay
                    date={date}
                    key={date.toISOString()}
                    className="p-1 ml-0.5 mr-0.5"
                  />
                )}
              </MiniCalendarDays>
              <MiniCalendarNavigation direction="next" className="gap-0" />
            </MiniCalendar>
          </div>
        </div>
        {workoutContentBlock}
      </div>
      <div className="sticky bottom-12 z-20 w-full flex justify-center bg-background/50 backdrop-blur-sm">
        <div className="mx-auto w-4/5 flex items-center justify-center gap-4 max-w-[728px]">
          {/* IMPORTANT: BUTTON WILL ONLY START TODAY'S WORKOUT... TODO: IF TODAY DOESN'T HAVE A WORKOUT, NOTHING WILL HAPPEN...!  */}
          <Button
            variant="default"
            className={`flex-1 text-base lg:hidden ${
              !todayWorkoutId && "pointer-events-none opacity-50"
            }`}
            onClick={handleWorkoutStart}
          >
            Start Workout
          </Button>
          <Button
            size={isLarge ? "default" : "icon"}
            variant="default"
            className="lg:flex-1 lg:h-9"
          >
            <MessageSquareMore size={isLarge ? 32 : 24} />
            <p className="lg:inline hidden button-styles text-base">
              Chat with workout agent
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
