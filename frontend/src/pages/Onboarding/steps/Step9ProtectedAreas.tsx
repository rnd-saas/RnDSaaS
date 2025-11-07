import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";


export default function Step9ProtectedAreas() {

    return (
        <div className="w-full max-w-md">
            <FieldGroup>
                <FieldSet>
                    <FieldLegend variant="label">Vulnerable areas</FieldLegend>
                    <FieldDescription>
                        Are there any areas you want to protect that need to be taken into account?
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                            <Checkbox id="shoulders" />
                            <FieldLabel htmlFor="shoulders" className="font-normal">Shoulders</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="lower-back" />
                            <FieldLabel htmlFor="lower-back" className="font-normal">Lower back</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="knees" />
                            <FieldLabel htmlFor="knees" className="font-normal">Knees</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="other" />
                            <FieldLabel htmlFor="other" className="font-normal">Other</FieldLabel>
                        {/*    todo: add text input field*/}
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </div>
    )
}