import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {GymComfortLevel, PreferredSplit} from "@/utils/InputTypes.tsx";


export default function Step11ComfortLevel() {
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
                <FieldGroup className="gap-3">
                    {comfortOptions.map((g) => (
                        <Field key={g.value} orientation="horizontal">
                            <Checkbox value={g.value} id={g.value} />
                            <FieldLabel htmlFor={g.value} className="font-normal">
                                {g.label}
                            </FieldLabel>
                        </Field>
                    ))}
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}