import {GymComfortLevel, GymComfortLevelValues} from "@/utils/InputTypes";

export const emotionOptions: { value: GymComfortLevel; label: string }[] = [
    { value: GymComfortLevelValues.Interested, label: "Interested" },
    { value: GymComfortLevelValues.Distressed, label: "Distressed" },
    { value: GymComfortLevelValues.Excited, label: "Excited" },
    { value: GymComfortLevelValues.Upset, label: "Upset" },
    { value: GymComfortLevelValues.Strong, label: "Strong" },
    { value: GymComfortLevelValues.Guilty, label: "Guilty" },
    { value: GymComfortLevelValues.Scared, label: "Scared" },
    { value: GymComfortLevelValues.Hostile, label: "Hostile" },
    { value: GymComfortLevelValues.Enthusiastic, label: "Enthusiastic" },
    { value: GymComfortLevelValues.Proud, label: "Proud" },
    { value: GymComfortLevelValues.Irritable, label: "Irritable" },
    { value: GymComfortLevelValues.Alert, label: "Alert" },
    { value: GymComfortLevelValues.Ashamed, label: "Ashamed" },
    { value: GymComfortLevelValues.Inspired, label: "Inspired" },
    { value: GymComfortLevelValues.Nervous, label: "Nervous" },
    { value: GymComfortLevelValues.Determined, label: "Determined" }
];