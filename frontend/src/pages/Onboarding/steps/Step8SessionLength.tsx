import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";


export default function Step8SessionLength() {

    return (
        <FieldSet>
            <FieldLegend>Session length</FieldLegend>
            <FieldDescription>
                How long do you want each session to be?
            </FieldDescription>
            <RadioGroup defaultValue="none">
                <Field orientation="horizontal">
                    <RadioGroupItem value="30" id="30" />
                    <FieldLabel htmlFor="30" className="font-normal">30 minutes</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="45" id="45" />
                    <FieldLabel htmlFor="45" className="font-normal">45 minutes</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="60" id="60" />
                    <FieldLabel htmlFor="60" className="font-normal">60 minutes</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="90" id="90" />
                    <FieldLabel htmlFor="90" className="font-normal">90 minutes</FieldLabel>
                </Field>
            </RadioGroup>
        </FieldSet>
    )
}