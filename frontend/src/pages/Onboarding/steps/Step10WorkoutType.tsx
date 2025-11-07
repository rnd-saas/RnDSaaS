import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";


export default function Step10WorkoutType() {

    return (
        <div className="w-full max-w-md">
            <FieldGroup>
                <FieldSet>
                    <FieldLegend variant="label">Workout type</FieldLegend>
                    <FieldDescription>
                        Which type of workouts would you like to do?
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                            <Checkbox id="full-body" />
                            <FieldLabel htmlFor="full-body" className="font-normal">Full body</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="upper-lower-body" />
                            <FieldLabel htmlFor="upper-lower-body" className="font-normal">Upper-lower body</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="push-pull-legs" />
                            <FieldLabel htmlFor="push-pull-legs" className="font-normal">Push-pull-legs</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="unknown" />
                            <FieldLabel htmlFor="unknown" className="font-normal">I don’t know, guide me</FieldLabel>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </div>
    )
}