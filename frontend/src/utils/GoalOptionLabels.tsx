import { PrimaryGoalValues } from "@/utils/InputTypes";
import type { PrimaryGoal } from "@/utils/InputTypes";
export const goalOptions: { value: PrimaryGoal; label: string }[] = [
    { value: PrimaryGoalValues.MuscleGain, label: "Build muscle" },
    { value: PrimaryGoalValues.FatLoss, label: "Lose fat" },
    { value: PrimaryGoalValues.Endurance, label: "Improve endurance" },
    { value: PrimaryGoalValues.Strength, label: "Get stronger" },
    { value: PrimaryGoalValues.Mobility, label: "Improve mobility" },
    { value: PrimaryGoalValues.GeneralFitness, label: "Just get active and consistent" },
];