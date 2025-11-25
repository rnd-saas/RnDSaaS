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

  // Store the remaining time before pausing
  const [storedExerciseSeconds, setStoredExerciseSeconds] = useState<number | null>(null);

  // --- countdown tick ---
  useEffect(() => {
    if (!isRunning) return;
    if (seconds <= 0) return;

    const id = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, seconds]);

  // --- auto-switch on timer end (exercise -> rest) ---
  useEffect(() => {
    if (seconds === 0 && mode === "exercise") {
      startRest();
    }
  }, [seconds, mode]);

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
  };

  const timeLabel = formatTime(seconds);

  // --- START exercise fresh OR return from rest ---
  const startExercise = () => {
    setMode("exercise");

    // If coming back from skip → restore old value
    if (storedExerciseSeconds !== null) {
      setSeconds(storedExerciseSeconds);
      setStoredExerciseSeconds(null);
    } else {
      setSeconds(INITIAL_EXERCISE_SECONDS);
    }

    setIsRunning(true);
  };

  // --- START rest, but PAUSE an active workout ---
  const startRest = () => {
    setMode("rest");

    // Save current workout time so Skip can restore it
    setStoredExerciseSeconds(seconds);

    setSeconds(INITIAL_REST_SECONDS);
    setIsRunning(true);
  };

  const adjustSeconds = (delta: number) => {
    setSeconds((prev) => Math.max(0, prev + delta));
  };

  const togglePause = () => {
    // PAUSE → go to rest screen
    if (isRunning) {
      startRest();
    } else {
      // RESUME → go back to exercise
      startExercise();
    }
  };

  const skipRest = () => {
    startExercise(); // restores saved time
  };

  return (
    <div className="relative min-h-[100dvh] bg-muted/40 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-background shadow-lg rounded-3xl pt-6 pb-8 px-6">
        {mode === "exercise" ? (
          <ExerciseScreen
            timeLabel={timeLabel}
            isRunning={isRunning}
            onTogglePause={togglePause}     // ← pause goes to rest!
            onSwitchToRest={startRest}      // optional top arrow
          />
        ) : (
          <RestScreen
            timeLabel={timeLabel}
            onMinus={() => adjustSeconds(-15)}
            onPlus={() => adjustSeconds(15)}
            onSkip={skipRest}               // ← restore previous workout time
            onSwitchToExercise={startExercise}
          />
        )}
      </div>
    </div>
  );
}
