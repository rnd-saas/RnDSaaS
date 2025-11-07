import { Checkbox } from "@/components/ui/checkbox"
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet,} from "@/components/ui/field"

export default function Step7WhichDays() {

    return (
        <div className="w-full max-w-md">
            <FieldGroup>
                <FieldSet>
                    <FieldLegend variant="label">
                        Availability
                    </FieldLegend>
                    <FieldDescription>
                        Which days of the week are you available to train most often? (multiple options possible)
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                            <Checkbox id="monday" />
                            <FieldLabel htmlFor="monday" className="font-normal">Monday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="tuesday" />
                            <FieldLabel htmlFor="tuesday" className="font-normal">Tuesday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="wednesday" />
                            <FieldLabel htmlFor="wednesday" className="font-normal">Wednesday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="thursday" />
                            <FieldLabel htmlFor="thursday" className="font-normal">Thursday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="friday" />
                            <FieldLabel htmlFor="friday" className="font-normal">Friday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="satursday" />
                            <FieldLabel htmlFor="saturday" className="font-normal">Saturday</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="sunsday" />
                            <FieldLabel htmlFor="sunday" className="font-normal">Sunday</FieldLabel>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </div>
    )
}