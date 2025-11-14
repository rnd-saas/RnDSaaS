import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/ui/button";

import restImg from "@/assets/workout/rest.png";
import benchPressImg from "@/assets/workout/bench-press.png";

type Mode = "rest" | "exercise";

const INITIAL_REST_SECONDS = 45;
const INITIAL_EXERCISE_SECONDS = 45;

export default function WorkoutPage() {
  const [mode, setMode] = useState<Mode>("exercise"); // start on exercise
  const [seconds, setSeconds] = useState(INITIAL_EXERCISE_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${mm} : ${ss}`;
  };

  const goToRest = () => {
    setMode("rest");
    setSeconds(INITIAL_REST_SECONDS);
    setIsRunning(true);
  };

  const goToExercise = () => {
    setMode("exercise");
    setSeconds(INITIAL_EXERCISE_SECONDS);
    setIsRunning(true);
  };

  const adjustSeconds = (delta: number) => {
    setSeconds((prev) => Math.max(0, prev + delta));
  };

  const skipRest = () => {
    goToExercise();
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const timeLabel = formatTime(seconds);

  return (
    <div className="min-h-[100dvh] bg-muted/40 flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-sm bg-background shadow-lg rounded-3xl pt-6 pb-8 px-6 relative">
        {mode === "rest" ? (
          <RestCard
            timeLabel={timeLabel}
            onMinus={() => adjustSeconds(-15)}
            onPlus={() => adjustSeconds(15)}
            onSkip={skipRest}
          />
        ) : (
          <ExerciseCard
            timeLabel={timeLabel}
            isRunning={isRunning}
            onTogglePause={togglePause}
          />
        )}

        {/* shared illustration */}
        <div className="mt-6 flex flex-col items-center">
          <img
            src={mode === "rest" ? restImg : benchPressImg}
            alt={mode === "rest" ? "Resting" : "Bench press"}
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* mode switch for testing; in real app you’d call goToRest/goToExercise from workout logic */}
        <div className="mt-6 flex justify-center gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            className={`underline-offset-4 ${
              mode === "exercise" ? "underline font-semibold" : ""
            }`}
            onClick={goToExercise}
          >
            Exercise view
          </button>
          <span>·</span>
          <button
            type="button"
            className={`underline-offset-4 ${
              mode === "rest" ? "underline font-semibold" : ""
            }`}
            onClick={goToRest}
          >
            Rest view
          </button>
        </div>

        {/* little chat button bottom-right */}
        <button
          type="button"
          className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-background shadow-md"
          aria-label="Open chat"
        >
          💬
        </button>
      </Card>
    </div>
  );
}

type RestCardProps = {
  timeLabel: string;
  onMinus: () => void;
  onPlus: () => void;
  onSkip: () => void;
};

function RestCard({ timeLabel, onMinus, onPlus, onSkip }: RestCardProps) {
  return (
    <>
      {/* top check icon */}
      <div className="flex justify-start mb-4">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-700 text-emerald-700">
          ✓
        </div>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Rest</h1>

        {/* timer */}
        <Button className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-background text-lg tracking-[0.3em] justify-center">
          {timeLabel}
        </Button>

        {/* +/- 15s */}
        <div className="flex gap-4 mt-2">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
            type="button"
            onClick={onMinus}
          >
            - 15 s
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
            type="button"
            onClick={onPlus}
          >
            + 15 s
          </Button>
        </div>

        {/* Skip */}
        <Button
          type="button"
          className="mt-3 w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-background"
          onClick={onSkip}
        >
          Skip
        </Button>
      </div>
    </>
  );
}

type ExerciseCardProps = {
  timeLabel: string;
  isRunning: boolean;
  onTogglePause: () => void;
};

function ExerciseCard({ timeLabel, isRunning, onTogglePause }: ExerciseCardProps) {
  return (
    <>
      {/* top chevron */}
      <div className="flex justify-start mb-4">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-500 text-amber-500">
          ˅
        </div>
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Bench Press</h1>

        {/* timer pill */}
        <div className="w-full h-12 rounded-xl bg-amber-300 flex items-center justify-center text-lg tracking-[0.3em]">
          {timeLabel}
        </div>

        {/* Pause button */}
        <Button
          type="button"
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-medium"
          onClick={onTogglePause}
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>
      </div>
    </>
  );
}
