import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export default function Step11Emotions() {
    const { control, trigger } = useFormContext<Inputs>();
    const emotionOptions: { value: string }[]  = [
        { value: "Interested"},
        { value: "Distressed"},
        { value: "Excited"},
        { value: "Upset"},
        { value: "Strong"},
        { value: "Guilty"},
        { value: "Scared"},
        { value: "Hostile"},
        { value: "Enthusiastic"},
        { value: "Proud"},
        { value: "Irritable"},
        { value: "Alert"},
        { value: "Ashamed"},
        { value: "Inspired"},
        { value: "Nervous"},
        { value: "Determined"}
    ];
    return (
        <FieldSet className="w-[100vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldLegend>Emotions</FieldLegend>
            <FieldDescription>
                How does going to the gym make you feel
            </FieldDescription>
            <Controller control={control} name="emotions" defaultValue={[]} rules={{required: "Please choose at least one emotion" }}
                render={({ field}) => (
                    <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm" className="w-[75vw] lg:w-[30vw] flex-wrap" value={field.value}
                                 onValueChange={(value) => {
                                     field.onChange(value);
                                     trigger("emotions");
                                 }}>
                        <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
                            {emotionOptions.map(emotion => (
                                <ToggleGroupItem value={emotion.value} className="data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-[var(--color-background)]">
                                    {emotion.value}
                                </ToggleGroupItem>
                            ))}
                        </div>
                    </ToggleGroup>
                )}
            />
        </FieldSet>
)
}