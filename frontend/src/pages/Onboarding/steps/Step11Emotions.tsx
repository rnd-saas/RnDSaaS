import { Controller, useFormContext } from "react-hook-form";
import type { Inputs } from "@/pages/Onboarding/OnboardingManager";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import type { GymComfortLevel } from "@/utils/InputTypes";
import {emotionOptions} from "@/utils/EmotionOptionLabels";

export default function Step11Emotions() {
    const { control, trigger } = useFormContext<Inputs>();
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