import ExerciseItem from "@/components/WorkoutComponents/ExerciseItem";
import { Button } from "@/components/WorkoutComponents/button";
import { MessageSquareMore } from "lucide-react";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/shadcn-io/mini-calendar";
import { useState } from "react";
import { addDays, startOfWeek } from "date-fns";

export default function WorkoutPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 justify-center items-center bg-(--basic-colours-zinc-50)">
      <MiniCalendar
        className="border-0 bg-background my-0"
        onValueChange={setSelectedDate}
        value={selectedDate}
        defaultStartDate={startOfWeek(selectedDate, { weekStartsOn: 1 })}
        days={7}
      >
        {/* note: if you need manage state of startDate too, add the state here! */}
        <MiniCalendarNavigation direction="prev" />
        <MiniCalendarDays>
          {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
        </MiniCalendarDays>
        <MiniCalendarNavigation direction="next" />
      </MiniCalendar>

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
