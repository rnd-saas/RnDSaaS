import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager";


export default function Step8SessionLength() {
    const { control } = useFormContext<Inputs>();
    const lengthOptions = [
        { id: "30", label: "30 minutes", value: "30" },
        { id: "45", label: "45 minutes", value: "45" },
        { id: "60", label: "60 minutes", value: "60" },
        { id: "90", label: "90 minutes", value: "90" },
        { id: "no-preference", label: "No preference", value: "no-preference" },
    ];
    return (
        <FieldSet className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldLegend>Session length</FieldLegend>
            <FieldDescription>
                How long do you want each session to be?
            </FieldDescription>
            <Controller control={control} name="strSessionDuration" defaultValue="60"
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                {lengthOptions.map((g) => (
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