import { PreferredSplitValues } from "@/utils/InputTypes";
import type { PreferredSplit } from "@/utils/InputTypes";

export const splitOptions: { value: PreferredSplit; label: string }[]  = [
    { value: PreferredSplitValues.DontKnow, label: "Suggest something for me" },
    { value: PreferredSplitValues.FullBody, label: "Full body" },
    { value: PreferredSplitValues.UpperLower, label: "Upper-lower body" },
    { value: PreferredSplitValues.PushPullLegs, label: "Push-pull-Legs" },
    { value: PreferredSplitValues.Other, label: "Other" },
];