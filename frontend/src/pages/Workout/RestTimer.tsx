// src/pages/Workout/RestTimer.tsx
import RestScreen from "./RestScreen";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWorkoutStore } from "@/lib/state/workoutStore";

export default function RestTimer() {
  const navigate = useNavigate();
  const { workoutId, exerciseSlug } = useParams();
  const restTime = useWorkoutStore(
    (state) =>
      state.loggedWorkout?.exercises?.find(
        (ex) => ex.exerciseInfo.slug === exerciseSlug
      )?.restTimeSeconds
  );
  const [timeLeft, setTimeLeft] = useState(restTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(`/workout/${workoutId}`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate, workoutId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} : ${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-dvh bg-muted/40 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-background shadow-lg rounded-3xl pt-6 pb-8 px-6">
        <RestScreen
          timeLabel={formatTime(timeLeft)}
          onMinus={() => setTimeLeft((t) => Math.max(0, t - 15))}
          onPlus={() => setTimeLeft((t) => t + 15)}
          onSkip={() => navigate(`/workout/${workoutId}`)}
          onSwitchToExercise={() => navigate(`/workout/${workoutId}`)}
        />
      </div>
    </div>
  );
}
