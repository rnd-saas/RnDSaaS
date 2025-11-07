import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet,} from "@/components/ui/field"
import {RadioGroup, RadioGroupItem,} from "@/components/ui/radio-group"
import {Gender} from "@/utils/InputTypes.tsx";

export default function Step2Gender() {
    const genderOptions: { value: Gender; label: string }[]  = [
        { value: Gender.Male, label: "Male" },
        { value: Gender.Female, label: "Female" },
        { value: Gender.NonBinary, label: "Non-binary" },
        { value: Gender.Other, label: "Other" },
        { value: Gender.PreferNotToSay, label: "Prefer not to say" },
    ];
    return (
        <FieldSet>
            <FieldLegend>Gender</FieldLegend>
            <FieldDescription>
                Which gender should we tailor the program for?
            </FieldDescription>
            <RadioGroup defaultValue={Gender.PreferNotToSay}>
                {genderOptions.map((g) => (
                    <Field key={g.value} orientation="horizontal">
                        <RadioGroupItem value={g.value} id={g.value} />
                        <FieldLabel htmlFor={g.value} className="font-normal">
                            {g.label}
                        </FieldLabel>
                    </Field>
                ))}
            </RadioGroup>
        </FieldSet>
    )
}