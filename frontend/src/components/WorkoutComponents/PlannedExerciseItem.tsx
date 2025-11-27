import { Card, CardContent } from "../card";
import { ChevronDown, HelpCircle, Timer } from "lucide-react";
import bench from "@/assets/icons/bench.svg";
import PlannedExerciseItemTable from "@/components/WorkoutComponents/PlannedExerciseItemTable";
import { useState } from "react";
import type { PlannedExercise } from "@/lib/types/Workout";
import { PlannedExerciseNote } from "@/components/WorkoutComponents/PlannedExerciseNote";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/WorkoutComponents/button";
import { formatRestTime } from "@/lib/utils/time.ts";

export default function PlannedExerciseItem({
  exercise,
}: {
  exercise: PlannedExercise;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  console.log(exercise);

  return (
    <>
      <Card
        className={`w-4/5 max-w-[728px] p-0 rounded-lg shadow-card shadow border-0 transform-all duration-300 ease-in-out ${
          isOpen
            ? "bg-white shadow-lg scale-102"
            : "bg-(--basic-colours-green-50) hover:scale-102"
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
                  {exercise.exerciseInfo.name}
                </h3>

                <HelpCircle
                  className="shrink-0 w-4 h-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/exercise/${exercise.exerciseInfo.slug}`);
                  }}
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
            <Button
              variant="link"
              className="flex justify-start items-center gap-1 px-0! focus:ring-0! cursor-default hover:no-underline"
            >
              <Timer color="#52525C" className="" />
              <span className="body-styles">
                Rest Time:{" "}
                {exercise.restTimeSeconds === 0
                  ? "OFF"
                  : formatRestTime(exercise.restTimeSeconds)}
              </span>
            </Button>
            <div className="w-full md:w-3/4 mb-2">
              <PlannedExerciseNote />
            </div>
            <PlannedExerciseItemTable
              sets={exercise.sets}
              logMode={exercise.exerciseInfo.logMode}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
