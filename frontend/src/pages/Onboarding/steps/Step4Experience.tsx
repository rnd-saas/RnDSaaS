import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";


export default function Step4Experience() {

    return (
        <FieldSet>
            <FieldLegend>Experience</FieldLegend>
            <FieldDescription>
                How experienced are you with training?
            </FieldDescription>
            <RadioGroup className="flex flex-row space-x-4">
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="0" id="beginner" />
                    <FieldLabel htmlFor="beginner">Total beginner<br/>(less than 6 months) </FieldLabel>
                </Field>
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="1" id="intermediate" />
                    <FieldLabel htmlFor="intermediate">Some experience<br/>(6 months - 1 year)</FieldLabel>
                </Field>
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="2" id="advanced" />
                    <FieldLabel htmlFor="advanced">Advanced<br/>(2-3 years) </FieldLabel>
                </Field>
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="3" id="expert" />
                    <FieldLabel htmlFor="expert">Expert<br/>(4-5 years) </FieldLabel>
                </Field>
            </RadioGroup>
        </FieldSet>
    )
}