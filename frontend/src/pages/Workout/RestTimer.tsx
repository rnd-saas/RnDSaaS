// src/pages/Workout/RestTimer.tsx
import RestScreen from "./RestScreen";
import { useNavigate } from "react-router-dom";

export default function RestTimer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-muted/40 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-background shadow-lg rounded-3xl pt-6 pb-8 px-6">
        <RestScreen
          timeLabel="00 : 45"
          onMinus={() => {}}
          onPlus={() => {}}
          onSkip={() => navigate("/workout/exercise")}
          onSwitchToExercise={() => navigate("/workout/exercise")}
        />
      </div>
    </div>
  );
}
