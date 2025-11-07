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
                    <RadioGroupItem value="beginner" id="beginner" />
                    <FieldLabel htmlFor="beginner">Total beginner<br/>(less than 6 months) </FieldLabel>
                </Field>
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <FieldLabel htmlFor="intermediate">Some experience<br/>(6 months - 1 year)</FieldLabel>
                </Field>
                <Field className="flex items-center flex-col" orientation="horizontal">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <FieldLabel htmlFor="experienced">Experienced lifter<br/>(2-5 years) </FieldLabel>
                </Field>
            </RadioGroup>
        </FieldSet>
    )
}