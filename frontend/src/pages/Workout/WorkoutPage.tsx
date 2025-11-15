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
    <div className="w-full min-h-screen flex flex-col bg-(--basic-colours-zinc-50)">
      <div className="flex-1 flex flex-col gap-[30px] items-center">
        <div className="flex flex-col gap-2 items-center mt-4 min-w-[60%]">
          <h3 className="h3-styles text-base font-bold">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </h3>
          <MiniCalendar
            className="border-0 bg-background my-0"
            onValueChange={setSelectedDate}
            value={selectedDate}
            defaultStartDate={startOfWeek(selectedDate!, { weekStartsOn: 1 })}
            days={7}
          >
            {/* note: if you need manage state of startDate too, add the state here! */}
            <MiniCalendarNavigation direction="prev" />
            <MiniCalendarDays>
              {(date) => (
                <MiniCalendarDay
                  date={date}
                  key={date.toISOString()}
                  className="p-1 ml-0.5 mr-0.5"
                />
              )}
            </MiniCalendarDays>
            <MiniCalendarNavigation direction="next" className="gap-0" />
          </MiniCalendar>
        </div>
        <div className="flex flex-col items-center justify-start flex-1 gap-5 md:gap-[30px] w-full">
          <ExerciseItem> </ExerciseItem>
          <ExerciseItem> </ExerciseItem>
          <ExerciseItem> </ExerciseItem>
          <ExerciseItem> </ExerciseItem>
          <ExerciseItem> </ExerciseItem>
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-background/50 py-4 flex justify-center px-4">
        <div className="mx-auto w-4/5 flex items-center justify-center gap-4 max-w-[728px]">
          <Button variant="default" className="flex-1 text-lg ">
            Start Workout
          </Button>
          <Button size="icon" variant="default">
            <MessageSquareMore size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
