import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";


export default function Step10ComfortLevel() {

    return (
        <div className="w-full max-w-md min-h-[60vh] min-w-[60vw]">
            <FieldGroup>
                <FieldSet>
                    <FieldLegend variant="label">Comfort level</FieldLegend>
                    <FieldDescription>
                        How comfortable do you feel at the gym? (multiple options possible)
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                            <Checkbox id="anxious" />
                            <FieldLabel htmlFor="anxious" className="font-normal">I feel anxious and insecure </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="nervous" />
                            <FieldLabel htmlFor="nervous" className="font-normal">I feel nervous</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="fine" />
                            <FieldLabel htmlFor="fine" className="font-normal">I feel fine most of the time</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="comfortable" />
                            <FieldLabel htmlFor="comfortable" className="font-normal">I’m comfortable</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="never-been" />
                            <FieldLabel htmlFor="never-been" className="font-normal">I have never been </FieldLabel>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </div>
    )
}