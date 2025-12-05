import { useRef } from "react";
import { useWorkoutStore } from "@/lib/state/workoutStore";

export function PlannedExerciseNote({
  bgColor,
  exerciseId,
}: {
  bgColor?: string;
  exerciseId?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const updateExercise = useWorkoutStore((state) => state.updateExercise);

  const autoGrow = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto"; // reset

    // Calculate natural height
    const scrollHeight = el.scrollHeight;

    // Line-height (browser computed)
    const lineHeight = parseInt(getComputedStyle(el).lineHeight);

    // Max height = 5 lines
    const maxHeight = lineHeight * 5;

    // Set height — capped at maxHeight
    el.style.height = Math.min(scrollHeight, maxHeight) + "px";

    if (el.scrollHeight === maxHeight) {
      // I want to the user to not be able to write anymore since then it would overflow the 5 line limit
      el.value = el.value.slice(0, -1);
      return;
    }
  };

  return (
    <textarea
      ref={ref}
      onInput={autoGrow}
      rows={1} // start small
      placeholder="Add notes..."
      className={`placeholder:text-muted-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md ${
        bgColor ?? "bg-[--var(basic-colours-green-50)]"
      } px-3 py-2 text-sm shadow-card outline-none resize-none overflow-hidden`}
      onBlur={(e) => {
        if (exerciseId) {
          updateExercise(exerciseId, { notes: e.target.value });
        }
      }}
    />
  );
}
export default PlannedExerciseNote;
