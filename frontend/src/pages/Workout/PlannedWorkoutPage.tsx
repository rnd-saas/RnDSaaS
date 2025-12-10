import PlannedExerciseItem from "@/components/WorkoutComponents/PlannedExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import ChatbotIcon from "@/assets/chatbotIcon.svg?react";
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
import { Separator } from "@/components/ui/separator";
// NEW IMPORTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWorkoutStore } from "@/lib/state/workoutStore";

export default function WorkoutPage() {
  const isLarge = window.matchMedia("(min-width: 1024px)").matches;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading, error } = usePlannedWorkout(selectedDate);
  const navigate = useNavigate();
  
  // NEW: Store hook
  const setPreWorkoutMood = useWorkoutStore((state) => state.setPreWorkoutMood);
  // NEW: State for the modal
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const plannedWorkout: PlannedWorkout | null = data ?? null;
  // Store today's ID for when user clicks on "Start Workout"
  const todayWorkoutId =
    plannedWorkout &&
    new Date(plannedWorkout.date).toDateString() === new Date().toDateString()
      ? plannedWorkout.workoutId
      : null;

  // MODIFIED: Open modal instead of navigating directy
  const handleWorkoutStartClick = () => {
    setIsMoodModalOpen(true);
  };

  // NEW: Handle mood selection and start
  const handleMoodSelect = (moodIndex: number) => {
    setPreWorkoutMood(moodIndex);
    setIsMoodModalOpen(false);
    navigate(`/workout/${todayWorkoutId}`);
  };

  const MOOD_EMOJIS = [
    { emoji: "😣", label: "Anxious", value: 0 },
    { emoji: "😬", label: "Nervous", value: 1 },
    { emoji: "🙂", label: "Okay", value: 2 },
    { emoji: "😌", label: "Good", value: 3 },
    { emoji: "🤩", label: "Great", value: 4 },
  ];

  let workoutContentBlock;
  if (isLoading) {
    workoutContentBlock = <div className="p-4 text-sm">Loading workout...</div>;
  } else if (error) {
    workoutContentBlock = (
      <div className="p-4 text-sm text-red-600">Failed to load workout.</div>
    );
  } else if (plannedWorkout?.isCompleted) {
    workoutContentBlock = (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4 mt-10">
        <h3 className="text-2xl font-bold text-green-700">
          Workout Completed!
        </h3>
        <p className="text-muted-foreground max-w-xs">
          Great job crushing your workout today. Rest up and get ready for the
          next one!
        </p>
      </div>
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
        {/* NEW: Workout Name & Description Header */}
        <div className="w-4/5 max-w-[728px] flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {plannedWorkout.name}
            </h2>
            {plannedWorkout.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {plannedWorkout.description}
              </p>
            )}
          </div>
          {/* Added Separator to distinguish header from list */}
          <Separator className="bg-border/60" />
        </div>

        {plannedWorkout.exercises.map((exercise: PlannedExercise) => (
          <PlannedExerciseItem key={exercise.exerciseId} exercise={exercise} />
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
              onValueChange={(d) => d && setSelectedDate(d)}
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
          <Button
            variant="default"
            className={`flex-1 text-base lg:hidden ${
              (!todayWorkoutId || plannedWorkout?.isCompleted) &&
              "pointer-events-none opacity-50"
            }`}
            // MODIFIED: Use the new handler
            onClick={handleWorkoutStartClick}
          >
            {plannedWorkout?.isCompleted ? "Completed" : "Start Workout"}
          </Button>
          <Button
            size={isLarge ? "default" : "icon"}
            variant="default"
            className="lg:flex-1 lg:h-9"
            onClick={() => navigate("/workout/plan-chatbot")}
          >
                    <ChatbotIcon className={`${isLarge ? "w-5 h-5" : "w-3 h-3"}`} />
            
            {/* <MessageSquareMore size={isLarge ? 32 : 24} /> */}
            <p className="lg:inline hidden button-styles text-base">
              Plan with your workout buddy
            </p>
          </Button>
        </div>
      </div>

      {/* NEW: Mood Check-in Dialog */}
      <Dialog open={isMoodModalOpen} onOpenChange={setIsMoodModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Check-in</DialogTitle>
            <DialogDescription className="text-center">
              How are you feeling right now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between md:gap-2 gap-0 py-4">
            {MOOD_EMOJIS.map((item) => (
              <button
                key={item.value}
                onClick={() => handleMoodSelect(item.value)}
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
