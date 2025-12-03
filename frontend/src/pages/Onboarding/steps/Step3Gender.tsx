import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet,} from "@/components/ui/field"
import {RadioGroup, RadioGroupItem,} from "@/components/ui/radio-group"
import {GenderValues} from "@/utils/InputTypes.tsx";
import type {Gender} from "@/utils/InputTypes.tsx";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";
import {Controller, useFormContext} from "react-hook-form";

export default function Step3Gender() {
    const { control } = useFormContext<Inputs>();
    const genderOptions: { value: Gender; label: string }[]  = [
        { value: GenderValues.Male, label: "Male" },
        { value: GenderValues.Female, label: "Female" },
        { value: GenderValues.NonBinary, label: "Non-binary" },
        { value: GenderValues.Other, label: "Other" },
        { value: GenderValues.PreferNotToSay, label: "Prefer not to say" },
    ];
    return (
        <FieldSet  className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldLegend>Gender</FieldLegend>
            <FieldDescription>
                Which gender should we tailor the program for?
            </FieldDescription>
            <Controller control={control} name="gender" defaultValue={GenderValues.PreferNotToSay} rules={{ required: "Gender is required" }}
                render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                        {genderOptions.map((g) => (
                            <Field key={g.value} orientation="horizontal">
                                <RadioGroupItem value={g.value} id={g.value} />
                                <FieldLabel htmlFor={g.value} className="font-normal">
                                    {g.label}
                                </FieldLabel>
                            </Field>
                        ))}
                    </RadioGroup>
                )}
            />
        </FieldSet>
    )
}