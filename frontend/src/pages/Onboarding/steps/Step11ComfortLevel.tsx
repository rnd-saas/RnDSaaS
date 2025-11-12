import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {GymComfortLevel} from "@/utils/InputTypes.tsx";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";


export default function Step11ComfortLevel() {
    const { control } = useFormContext<Inputs>();
    const comfortOptions: { value: GymComfortLevel; label: string }[]  = [
        { value: GymComfortLevel.Anxious, label: "I feel anxious and insecure" },
        { value: GymComfortLevel.Nervous, label: "I feel nervous" },
        { value: GymComfortLevel.Fine, label: "I feel fine most of the time" },
        { value: GymComfortLevel.Comfortable, label: "I’m comfortable" },
        { value: GymComfortLevel.NeverBeen, label: "I have never been" },
    ];
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Comfort level</FieldLegend>
                <FieldDescription>
                    How comfortable do you feel at the gym? (multiple options possible)
                </FieldDescription>
                <Controller name="comfortLevel" control={control} defaultValue={[]} rules={{ required: "Please provide a comfort level" }}
                            render={({ field }) => {
                                const selected: GymComfortLevel[] = field.value || [];
                                const toggleValue = (val: GymComfortLevel) => {
                                    if (selected.includes(val)) {
                                        field.onChange(selected.filter((v) => v !== val));
                                    } else {
                                        field.onChange([...selected, val]);
                                    }
                                };
                                return (
                                    <FieldGroup className="gap-3">
                                        {comfortOptions.map(comfort => (
                                            <Field key={comfort.value} orientation="horizontal">
                                                <Checkbox id={comfort.value} checked={selected.includes(comfort.value)} onCheckedChange={() => toggleValue(comfort.value)}/>
                                                <FieldLabel htmlFor={comfort.value} className="font-normal">{comfort.label}</FieldLabel>
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