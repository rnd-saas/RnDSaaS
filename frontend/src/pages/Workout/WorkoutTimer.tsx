// src/pages/Workout/WorkoutTimer.tsx
import ExerciseScreen from "./WorkoutScreen";

export default function WorkoutTimer() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-6 bg-muted/40">
      <ExerciseScreen
        timeLabel="00 : 45"
        isRunning={true}
        onTogglePause={() => {}}
        onSwitchToRest={() => {}}
      />
    </div>
  );
}
