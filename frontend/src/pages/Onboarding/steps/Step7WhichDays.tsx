import { Checkbox } from "@/components/ui/checkbox"
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet,} from "@/components/ui/field"

export default function Step7WhichDays() {

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend variant="label">
                    Availability
                </FieldLegend>
                <FieldDescription>
                    Which days of the week are you available to train most often?<br/>(multiple options possible)
                </FieldDescription>
                <FieldGroup className="gap-3 flex justify-center">
                    <Field orientation="horizontal">
                        <Checkbox id="monday" value={"0"}/>
                        <FieldLabel htmlFor="monday" className="font-normal">Monday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="tuesday" value={"1"}/>
                        <FieldLabel htmlFor="tuesday" className="font-normal">Tuesday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="wednesday" value={"2"}/>
                        <FieldLabel htmlFor="wednesday" className="font-normal">Wednesday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="thursday" value={"3"}/>
                        <FieldLabel htmlFor="thursday" className="font-normal">Thursday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="friday" value={"4"}/>
                        <FieldLabel htmlFor="friday" className="font-normal">Friday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="satursday" value={"5"}/>
                        <FieldLabel htmlFor="saturday" className="font-normal">Saturday</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="sunsday" value={"6"}/>
                        <FieldLabel htmlFor="sunday" className="font-normal">Sunday</FieldLabel>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}