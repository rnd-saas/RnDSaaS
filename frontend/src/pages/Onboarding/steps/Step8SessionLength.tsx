import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager";
import {lengthOptions} from "@/utils/SessionLengthOptionLabels";


export default function Step8SessionLength() {
    const { control } = useFormContext<Inputs>();
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