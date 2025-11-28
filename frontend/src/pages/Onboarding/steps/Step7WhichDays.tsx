import { Checkbox } from "@/components/ui/checkbox"
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet,} from "@/components/ui/field"
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";

export default function Step7WhichDays() {
    const { control, getValues } = useFormContext<Inputs>();
    const dayOptions = [
        { id: "monday", label: "Monday", value: "0" },
        { id: "tuesday", label: "Tuesday", value: "1" },
        { id: "wednesday", label: "Wednesday", value: "2" },
        { id: "thursday", label: "Thursday", value: "3" },
        { id: "friday", label: "Friday", value: "4" },
        { id: "saturday", label: "Saturday", value: "5" },
        { id: "sunday", label: "Sunday", value: "6" },
    ];
    const minDays = Number(getValues("strDaysPerWeek"))|| 1;
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend variant="label">
                    Availability
                </FieldLegend>
                <FieldDescription>
                    Which days of the week are you available to train most often?<br/>(multiple options possible)
                </FieldDescription>
                <Controller name="strAvailableDays" control={control} defaultValue={[]}
                    rules={{
                        validate: (value: string[]) => {
                            return value.length >= minDays || `Please select at least ${minDays} days`;
                        }
                    }}
                    render={({ field }) => {
                        const selected = field.value || [];
                        const toggleValue = (val: string) => {
                            if (selected.includes(val)) {
                                field.onChange(selected.filter(v => v !== val)); // remove
                            } else {
                                field.onChange([...selected, val]); // add
                            }
                        };
                        return (
                            <FieldGroup className="gap-3 flex justify-center">
                                {dayOptions.map(day => (
                                    <Field key={day.id} orientation="horizontal">
                                        <Checkbox id={day.id} checked={selected.includes(day.value)} onCheckedChange={() => toggleValue(day.value)}/>
                                        <FieldLabel htmlFor={day.id} className="font-normal">{day.label}</FieldLabel>
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