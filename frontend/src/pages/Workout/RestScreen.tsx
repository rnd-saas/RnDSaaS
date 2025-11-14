import restImg from "@/assets/workout/rest-image.png";
import { Button } from "@/components/ui/button";

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
  onSwitchToExercise,
}: RestScreenProps) {
  return (
    <>
      {/* Top icon – can be used to jump back to the exercise view */}
      <div className="mb-4 flex justify-start">
        <button
          type="button"
          onClick={onSwitchToExercise}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-700 text-emerald-700"
          aria-label="Back to exercise"
        >
          ✓
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Rest</h1>

        <img
          src={restImg}
          alt="Resting between sets"
          className="h-48 w-48 object-contain"
        />

        {/* Timer pill */}
        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-emerald-700 text-[var(--color-background)] tracking-[0.3em] hover:bg-emerald-800"
        >
          {timeLabel}
        </Button>

        {/* +/- 15s buttons */}
        <div className="flex w-full gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onMinus}
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
          >
            - 15 s
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onPlus}
            className="flex-1 h-11 rounded-xl border-emerald-700 text-emerald-700"
          >
            + 15 s
          </Button>
        </div>

        {/* Skip button */}
        <Button
          type="button"
          onClick={onSkip}
          className="h-12 w-full rounded-xl bg-emerald-700 text-[var(--color-background)] hover:bg-emerald-800"
        >
          Skip
        </Button>

        {/* Chat FAB (bottom-right in the card) */}
        <div className="mt-4 self-end">
          <Button
            type="button"
            size="icon"
            className="rounded-full bg-emerald-700 text-[var(--color-background)] hover:bg-emerald-800"
            aria-label="Open chat"
          >
            💬
          </Button>
        </div>
      </div>
    </>
  );
}
