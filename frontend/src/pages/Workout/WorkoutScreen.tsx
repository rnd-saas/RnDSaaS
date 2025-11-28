///src/pages/Workout/WorkoutScreen.tsx
import workoutImg from "@/assets/workout/workout-image.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ExerciseScreenProps = {
  timeLabel: string;
  isRunning: boolean;
  onTogglePause?: () => void;
  onSwitchToRest?: () => void;
};

export default function ExerciseScreen({
  timeLabel,
  isRunning,
  onTogglePause,
}: ExerciseScreenProps) {
  const pauseLabel = isRunning ? "Pause" : "Resume";

  return (
    <>
      {/* Top arrow – optional back to rest or workout list */}
      <div className="mb-4 flex justify-start">
      <button
        onClick={() => window.history.back()}
        aria-label="Go back"
        className="
          absolute left-4 top-4 z-10 
          rounded-full p-2 bg-white shadow 
          hover:bg-accent transition
        "
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Bench Press</h1>

        <img
          src={workoutImg}
          alt="Bench press exercise"
          className="h-48 w-48 object-contain"
        />

        {/* Timer pill */}
        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-amber-300 tracking-[0.3em] hover:bg-amber-400 text-slate-900"
        >
          {timeLabel}
        </Button>

        {/* Pause / Resume button */}
        <Button
          type="button"
          onClick={onTogglePause}
          className="h-12 w-full rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900"
        >
          {pauseLabel}
        </Button>

        
      </div>
    </>
  );
}
