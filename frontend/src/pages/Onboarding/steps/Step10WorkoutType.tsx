import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {PreferredSplit} from "@/utils/InputTypes.tsx";
import {RadioGroupItem} from "@/components/ui/radio-group.tsx";


export default function Step10WorkoutType() {
    const splitOptions: { value: PreferredSplit; label: string }[]  = [
        { value: PreferredSplit.DontKnow, label: "Suggest something for me" },
        { value: PreferredSplit.FullBody, label: "Full body" },
        { value: PreferredSplit.UpperLower, label: "Upper-lower body" },
        { value: PreferredSplit.PushPullLegs, label: "Push-pull-Legs" },
        { value: PreferredSplit.Other, label: "Other" },
    ];
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Workout type</FieldLegend>
                <FieldDescription>
                    Which type of workouts would you like to do?
                </FieldDescription>
                <FieldGroup className="gap-3">
                    {splitOptions.map((g) => (
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