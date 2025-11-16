import { Card, CardContent } from "../card";
import { ChevronDown, HelpCircle } from "lucide-react";
import bench from "@/assets/icons/bench.svg";
import LoggedExerciseItemTable from "@/components/WorkoutComponents/LoggedExerciseItemTable";
import { useState } from "react";
import type { PlannedExercise } from "@/lib/types/Workout";
import { ExerciseNote } from "@/components/WorkoutComponents/ExerciseNote";

export default function LoggedExerciseItem({
  exercise,
}: {
  exercise: PlannedExercise;
}) {
  const [isOpen, setIsOpen] = useState(false);

  console.log(exercise);

  return (
    <>
      <Card
        className={`w-4/5 max-w-[728px] p-0 rounded-lg shadow-card shadow border-0 transform-all duration-300 ease-in-out ${
          isOpen
            ? "bg-(--basic-colours-yellow-50) shadow-lg scale-102"
            : "bg-(--basic-colours-yellow-50) hover:bg-(--basic-colours-yellow-100) active:bg-(--basic-colours-yellow-300)/50 hover:scale-102"
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
                <h3 className="flex-1h3-styles text-base md:text-xl lg:text-base font-bold min-w-0">
                  {exercise.exerciseInfo.name}
                </h3>

                <HelpCircle className="flex-shrink-0 w-4 h-4" />
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 flex-initial transition-transform duration-300 ease-in  ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`overflow-hidden w-full pl-2 pr-2 md:pl-4 md:pr-4 transition-all duration-300 ease-in ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="w-full md:w-3/4 mb-4">
              <ExerciseNote bgColor="bg-white " />
            </div>
            <LoggedExerciseItemTable
              sets={exercise.sets}
              logMode={exercise.exerciseInfo.logMode}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
