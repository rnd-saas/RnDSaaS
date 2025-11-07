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
                <Field orientation={"vertical"} >
                    <RadioGroupItem value="beginner" id="beginner" />
                    <FieldLabel htmlFor="beginner">Total beginner<br/>(less than 6 months) </FieldLabel>
                </Field>
                <div className="flex items-center flex-col">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <label htmlFor="intermediate">Some experience<br/>(6 months - 1 year)</label>
                </div>
                <div className="flex items-center flex-col">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <label htmlFor="experienced">Experienced lifter<br/>(2-5 years) </label>
                </div>
            </RadioGroup>
        </FieldSet>
    )
}