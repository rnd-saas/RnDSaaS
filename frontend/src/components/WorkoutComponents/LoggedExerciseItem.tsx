import { Card, CardContent } from "../card";
import { ChevronDown, HelpCircle } from "lucide-react";
import bench from "@/assets/icons/bench.svg";
import LoggedExerciseItemTable from "@/components/WorkoutComponents/LoggedExerciseItemTable";
import { useState } from "react";
import type { PlannedExercise } from "@/lib/types/Workout";
import { LoggedExerciseNote } from "@/components/WorkoutComponents/LoggedExerciseNote";
import { Timer } from "lucide-react";
import { Button } from "@/components/WorkoutComponents/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateRestTimeOptions, formatRestTime } from "@/lib/utils/time.ts";
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { usePlannedWorkout } from "@/api/workouts";
import { useNavigate } from "react-router-dom";

export default function LoggedExerciseItem({
  plannedExerciseId,
}: {
  plannedExerciseId: string;
  // plannedExercise: PlannedExercise;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = usePlannedWorkout(new Date());
  const plannedWorkout = data;
  while (isLoading) {
    return;
  }
  const plannedExercise = plannedWorkout?.exercises.find((exercise) => {
    return exercise.exerciseInfo.exerciseId === plannedExerciseId;
  }) as PlannedExercise;

  const [restTimeSeconds, setRestTimeSeconds] = useState<string>(
    plannedExercise.restTimeSeconds.toString()
  );
  const restTimeOptions: number[] = calculateRestTimeOptions(5, 300);

  return (
    <>
      <Card
        className={`w-4/5 max-w-[728px] p-0 rounded-lg shadow-card shadow border-0 transform-all duration-300 ease-in-out ${
          isOpen
            ? "bg-yellow-50 shadow-lg scale-102"
            : "bg-yellow-50 hover:bg-yellow-100 active:bg-(--basic-colours-yellow-300)/50 hover:scale-102"
        }`}
      >
        <CardContent className="flex flex-col gap-0 items-center pl-2 pr-2 md:pl-4 md:pr-4">
          <div
            className="w-full flex justify-start items-center pt-4 pb-4 pl-2 pr-2 gap-2 md:gap-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-1 items-center gap-2">
              <div
                className="w-[46px] h-[46px] bg-cover bg-center"
                style={{ backgroundImage: `url(${bench})` }} // TODO: TO BE MODIFIED ADDED LATER!
              />

              <div className="flex-1 flex items-center justify-between md:justify-start  gap-1 md:gap-2">
                <h3 className="flex-1 h3-styles text-base md:text-xl lg:text-base font-bold min-w-0">
                  {plannedExercise.exerciseInfo.name}
                </h3>

                <HelpCircle
                  onClick={() =>
                    navigate(
                      `../../exercise/${plannedExercise.exerciseInfo.slug}`
                    )
                  }
                  className="shrink-0 w-4 h-4"
                />
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 flex-initial transition-transform duration-300 ease-in  ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`flex flex-col gap-2 overflow-hidden w-full pl-2 pr-2 md:pl-4 md:pr-4 transition-all duration-300 ease-in ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="flex justify-start items-center gap-1 px-0! focus:ring-0!"
                >
                  <Timer color="#52525C" className="" />
                  <span className="body-styles">
                    Rest Time:{" "}
                    {restTimeSeconds == "0"
                      ? "OFF"
                      : formatRestTime(parseInt(restTimeSeconds))}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto outline-none border-0 shadow-card">
                <DropdownMenuLabel>Set Rest Time</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  defaultValue="OFF"
                  className="text-center flex flex-col items-center justify-center"
                  value={restTimeSeconds.toString()}
                  onValueChange={setRestTimeSeconds} //TODO: CHANGE TO USE LOGGEDWORKOUT RESTTIME VALUE INSTEAD.
                >
                  <DropdownMenuRadioItem key={0} value={"0"}>
                    OFF
                  </DropdownMenuRadioItem>
                  {restTimeOptions.map((restTimeOption: number) => (
                    <DropdownMenuRadioItem
                      key={restTimeOption}
                      value={restTimeOption.toString()}
                    >
                      {formatRestTime(restTimeOption)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-full md:w-3/4 mb-2">
              <LoggedExerciseNote
                bgColor="bg-white "
                exerciseId={plannedExerciseId}
              />
            </div>
            <LoggedExerciseItemTable
              exerciseId={plannedExercise.exerciseInfo.exerciseId}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
