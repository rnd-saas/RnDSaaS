import { Controller, useFormContext } from "react-hook-form";
import type { Inputs } from "@/pages/Onboarding/OnboardingManager";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import type { GymComfortLevel } from "@/utils/InputTypes";
import { GymComfortLevelValues } from "@/utils/InputTypes";

export default function Step11Emotions() {
    const { control, trigger } = useFormContext<Inputs>();
    const emotionOptions: { value: GymComfortLevel; label: string }[] = [
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
    return (
        <FieldSet>
            <FieldLegend>Comfort level</FieldLegend>
            <FieldDescription>
                How does going to the gym make you feel?
            </FieldDescription>
            <Controller
                control={control}
                name="comfortLevel"
                defaultValue={[] as GymComfortLevel[]}
                rules={{ required: "Please choose at least one emotion" }}
                render={({ field }) => (
                    <ToggleGroup
                        type="multiple"
                        variant="outline"
                        spacing={2}
                        size="sm"
                        className="w-[75vw] flex-wrap"
                        value={field.value ?? []}
                        onValueChange={(value) => {
                            field.onChange(value as GymComfortLevel[]);
                            trigger("comfortLevel");
                        }}
                    >
                        <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
                            {emotionOptions.map((emotion) => (
                                <ToggleGroupItem
                                    key={emotion.value}
                                    value={emotion.value}
                                    className="data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-[var(--color-background)]"
                                >
                                    {emotion.label}
                                </ToggleGroupItem>
                            ))}
                        </div>
                    </ToggleGroup>
                )}
            />
        </FieldSet>
    );
}