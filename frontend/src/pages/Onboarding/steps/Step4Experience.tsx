import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";


export default function Step4Experience() {
    const { control } = useFormContext<Inputs>();
    const expOptions = [
        { id: "beginner", top: "Total beginner", bottom: "(less than 6 months)", value: "0" },
        { id: "intermediate", top: "Some experience", bottom: "(6 months - 1 year)", value: "1" },
        { id: "advanced", top: "Advanced", bottom: "(2–3 years)", value: "2" },
        { id: "expert", top: "Expert", bottom: "(4–5 years)", value: "3" },
    ];
    return (
        <FieldSet>
            <FieldLegend>Experience</FieldLegend>
            <FieldDescription>
                How experienced are you with training?
            </FieldDescription>
            <Controller control={control} name="strExperience" defaultValue="" rules={{ required: "Please give an approximate experience level" }}
                 render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-row space-x-4">
                        {expOptions.map((g) => (
                            <Field className="flex items-center flex-col" orientation="horizontal" key={g.value}>
                                <RadioGroupItem value={g.value} id={g.value} />
                                <FieldLabel htmlFor={g.value} className="font-normal flex flex-col text-center">
                                    <span>{g.top}</span>
                                    <span>{g.bottom}</span>
                                </FieldLabel>
                            </Field>
                        ))}
                    </RadioGroup>
                 )}
            />
        </FieldSet>
    )
}