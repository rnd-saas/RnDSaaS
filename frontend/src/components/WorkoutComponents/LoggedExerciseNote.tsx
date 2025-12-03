import { useRef } from "react";
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { usePlannedWorkout } from "@/api/workouts";

export function LoggedExerciseNote({
  bgColor,
  exerciseId,
}: {
  bgColor?: string;
  exerciseId: string;
}): JSX.Element {
  const ref = useRef<HTMLTextAreaElement>(null);
  const updateExercise = useWorkoutStore((state) => state.updateExercise);

  const loggedExercise = useWorkoutStore((state) =>
    state.getExercise(exerciseId)
  );
  const { data: plannedWorkout } = usePlannedWorkout(new Date());
  const plannedExercise = plannedWorkout?.exercises.find(
    (ex) => ex.exerciseInfo.exerciseId === exerciseId
  );

  const noteValue = loggedExercise?.notes ?? plannedExercise?.notes ?? "";

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
      defaultValue={noteValue}
      className={`placeholder:text-muted-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md ${
        bgColor ?? "bg-[--var(basic-colours-green-50)]"
      } px-3 py-2 text-sm shadow-card outline-none resize-none overflow-hidden`}
      onBlur={(e) => {
        updateExercise(exerciseId, { notes: e.target.value });
      }}
    />
  );
}
export default LoggedExerciseNote;
