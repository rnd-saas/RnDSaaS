import ExerciseItem from "@/pages/Workout/WorkoutComponents/ExerciseItem";
import { Button } from "@/components/ui/button";

export default function WorkoutPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 justify-center items-center bg-(--basic-colours-zinc-50)">
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <Button variant="default">Complete Workout</Button>
    </div>
  );
}
