import ExerciseItem from "@/pages/Workout/WorkoutComponents/ExerciseItem";
import { Button } from "@/components/ui/button";
import { MessageSquareMore } from "lucide-react";

export default function WorkoutPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 justify-center items-center bg-(--basic-colours-zinc-50)">
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <ExerciseItem> </ExerciseItem>
      <div className="flex w-4/5 max-w-[420px] gap-4">
        <Button variant="default" className="flex-1">
          Complete Workout
        </Button>
        <Button size="icon" variant="default">
          <MessageSquareMore size={24} />
        </Button>
      </div>
    </div>
  );
}
