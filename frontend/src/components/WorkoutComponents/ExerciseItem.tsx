import { Card, CardContent } from "../card";
import { ChevronDown, HelpCircle } from "lucide-react";
import React from "react";
import bench from "@/assets/icons/bench.svg";
import ExerciseItemTable from "./ExerciseItemTable";
import { useState } from "react";

export default function ExerciseItem() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card
        className={`w-4/5 max-w-[420px] p-0 rounded-lg shadow-card shadow border-0 transform-all duration-300 ease-in-out ${
          isOpen
            ? "bg-white"
            : "bg-(--basic-colours-green-50) hover:bg-(--basic-colours-green-100) hover:scale-102"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardContent className="flex flex-col gap-0 items-center pl-4 pr-4">
          <div className="w-full flex justify-start items-center pt-4 pb-4 pl-2 pr-2">
            <div className="flex flex-1 items-center gap-2">
              <div
                className="w-[46px] h-[46px] bg-cover bg-center"
                style={{ backgroundImage: `url(${bench})` }}
              />

              <div className="flex items-center gap-[5px]">
                <h3 className="text-(length:--h3-font-size) font-(--h3-font-weight) text-(--intuitive-names-text) flex-1 min-w-0">
                  Bench Press
                </h3>

                <HelpCircle className="w-4 h-4" />
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 flex-initial transition-transform duration-300 ease-in  ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`overflow-hidden w-full pl-4 pr-4 transition-all duration-300 ease-in ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ExerciseItemTable />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
