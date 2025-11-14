import { Card, CardContent } from "../../../components/card";
import { ChevronDown, HelpCircle } from "lucide-react";
import React from "react";
import bench from "@/assets/icons/bench.svg";
import ExerciseItemTable from "./ExerciseItemTable";

export default function ExerciseItem() {
  return (
    <>
      <Card className="w-4/5 max-w-[420px] p-0 rounded-lg bg-(--basic-colours-green-50) shadow-card">
        <CardContent className="flex justify-start items-center gap-15 p-4">
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

          <ChevronDown className="w-4 h-4 flex-initial" />
        </CardContent>
        <ExerciseItemTable />
      </Card>
    </>
  );
}
