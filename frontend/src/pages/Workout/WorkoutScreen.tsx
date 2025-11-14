import workoutImg from "@/assets/workout/workout-image.png";
import { Button } from "@/components/ui/button";

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
  onSwitchToRest,
}: ExerciseScreenProps) {
  const pauseLabel = isRunning ? "Pause" : "Resume";

  return (
    <>
      {/* Top arrow – optional back to rest or workout list */}
      <div className="mb-4 flex justify-start">
        <button
          type="button"
          onClick={onSwitchToRest}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-500 text-amber-500"
          aria-label="Go to rest"
        >
          ˅
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
