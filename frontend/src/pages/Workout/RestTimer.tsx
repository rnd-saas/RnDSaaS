// src/pages/Workout/RestTimer.tsx
import RestScreen from "./RestScreen";

export default function RestTimer() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-6 bg-muted/40">
      <RestScreen
        timeLabel="00 : 45"
        onMinus={() => {}}
        onPlus={() => {}}
        onSkip={() => {}}
        onSwitchToExercise={() => {}}
      />
    </div>
  );
}
