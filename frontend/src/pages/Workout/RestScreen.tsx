//src/pages/Workout/RestScreen.tsx
import restImg from "@/assets/workout/rest-image.png";
import { Button } from "@/components/ui/button";
import ChatbotButton from "@/components/chatbotButton.tsx";

type RestScreenProps = {
  timeLabel: string;
  onMinus?: () => void;
  onPlus?: () => void;
  onSkip?: () => void;
  onSwitchToExercise?: () => void;
};

export default function RestScreen({
  timeLabel,
  onMinus,
  onPlus,
  onSkip,
}: RestScreenProps) {
  return (
    <>
      {/* Spacer keeps layout consistent with ExerciseScreen */}
      <div className="mb-4 h-6" />

      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Rest</h1>

        <img
          src={restImg}
          alt="Resting between sets"
          className="h-48 w-48 object-contain"
        />

        {/* Timer */}
        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-emerald-700 text-[var(--color-background)] tracking-[0.3em] hover:bg-emerald-800"
        >
          {timeLabel}
        </Button>

        {/* +/- 15 seconds */}
        <div className="flex w-full gap-4">
          <Button
            variant="outline"
            onClick={onMinus}
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
          >
            - 15 s
          </Button>
          <Button
            variant="outline"
            onClick={onPlus}
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
          >
            + 15 s
          </Button>
        </div>

        {/* Skip */}
        <Button
          type="button"
          onClick={onSkip}
          className="h-12 w-full rounded-xl bg-emerald-700 text-[var(--color-background)] hover:bg-emerald-800"
        >
          Skip
        </Button>

        {/* Chat button */}
        <div className="mt-4 self-end">
          <ChatbotButton/>
        </div>
      </div>
    </>
  );
}
