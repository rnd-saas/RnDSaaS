import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {PreferredSplitValues} from "@/utils/InputTypes.tsx";
import type {PreferredSplit} from "@/utils/InputTypes.tsx";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";


export default function Step10WorkoutType() {
    const { control } = useFormContext<Inputs>();
    const splitOptions: { value: PreferredSplit; label: string }[]  = [
        { value: PreferredSplitValues.DontKnow, label: "Suggest something for me" },
        { value: PreferredSplitValues.FullBody, label: "Full body" },
        { value: PreferredSplitValues.UpperLower, label: "Upper-lower body" },
        { value: PreferredSplitValues.PushPullLegs, label: "Push-pull-Legs" },
        { value: PreferredSplitValues.Other, label: "Other" },
    ];
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Workout type</FieldLegend>
                <FieldDescription>
                    Which type of workouts would you like to do?
                </FieldDescription>
                <Controller
                    name="preferredSplit"
                    control={control}
                    defaultValue={[]}
                    rules={{
                        validate: (value) => (value && value.length > 0) || "Please select at least one option",
                    }}
                    render={({ field }) => {
                        const selected: PreferredSplit[] = field.value || [];
                        const toggleValue = (val: PreferredSplit) => {
                            if (selected.includes(val)) {
                                field.onChange(selected.filter((v) => v !== val));
                            } else {
                                field.onChange([...selected, val]);
                            }
                        };
                        return (
                            <FieldGroup className="gap-3">
                                {splitOptions.map(split => (
                                    <Field key={split.value} orientation="horizontal">
                                        <Checkbox id={split.value} checked={selected.includes(split.value)} onCheckedChange={() => toggleValue(split.value)}/>
                                        <FieldLabel htmlFor={split.value} className="font-normal">{split.label}</FieldLabel>
                                    </Field>
                                ))}
                            </FieldGroup>
                        );
                    }}
                />
            </FieldSet>
        </FieldGroup>
    )
}