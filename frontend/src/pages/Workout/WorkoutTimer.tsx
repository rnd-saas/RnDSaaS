// src/pages/Workout/WorkoutTimer.tsx
import { useEffect, useState } from "react";
import RestScreen from "./RestScreen";
import ExerciseScreen from "./WorkoutScreen";

type Mode = "exercise" | "rest";

const INITIAL_EXERCISE_SECONDS = 45;
const INITIAL_REST_SECONDS = 45;

export default function WorkoutTimer() {
  const [mode, setMode] = useState<Mode>("exercise");
  const [seconds, setSeconds] = useState(INITIAL_EXERCISE_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // --- countdown tick ---
  useEffect(() => {
    if (!isRunning) return;
    if (seconds <= 0) return;

    const id = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, seconds]);

  // --- auto-switch: workout -> rest when timer hits 0 ---
  useEffect(() => {
    if (seconds === 0 && mode === "exercise") {
      startRest();
    }
    // If you later want rest -> exercise auto-switch,
    // you can add: if (seconds === 0 && mode === "rest") startExercise();
  }, [seconds, mode]);

  // helpers
  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  const timeLabel = formatTime(seconds);

  const startExercise = () => {
    setMode("exercise");
    setSeconds(INITIAL_EXERCISE_SECONDS);
    setIsRunning(true);
  };

  const startRest = () => {
    setMode("rest");
    setSeconds(INITIAL_REST_SECONDS);
    setIsRunning(true);
  };

  const adjustSeconds = (delta: number) => {
    setSeconds((prev) => Math.max(0, prev + delta));
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const skipRest = () => {
    // skipping rest jumps back to exercise
    startExercise();
  };

  return (
    <div className="min-h-[100dvh] bg-muted/40 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-background shadow-lg rounded-3xl pt-6 pb-8 px-6">
        {mode === "exercise" ? (
          <ExerciseScreen
            timeLabel={timeLabel}
            isRunning={isRunning}
            onTogglePause={togglePause}
            onSwitchToRest={startRest} // top arrow
          />
        ) : (
          <RestScreen
            timeLabel={timeLabel}
            onMinus={() => adjustSeconds(-15)}
            onPlus={() => adjustSeconds(15)}
            onSkip={skipRest}
            onSwitchToExercise={startExercise} // top ✓
          />
        )}
      </div>
    </div>
  );
}
