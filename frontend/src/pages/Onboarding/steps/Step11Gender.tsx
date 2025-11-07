import {Field, FieldDescription, FieldLabel, FieldSet,} from "@/components/ui/field"
import {RadioGroup, RadioGroupItem,} from "@/components/ui/radio-group"

export default function Step11Gender() {
        return (
            <div className="w-full max-w-md">
                <FieldSet>
                    <FieldLabel>Gender</FieldLabel>
                    <FieldDescription>
                        Which gender should we tailor the program for?
                    </FieldDescription>
                    <RadioGroup defaultValue="none">
                        <Field orientation="horizontal">
                            <RadioGroupItem value="male" id="male" />
                            <FieldLabel htmlFor="male" className="font-normal">Male</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <RadioGroupItem value="female" id="female" />
                            <FieldLabel htmlFor="female" className="font-normal">Female</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <RadioGroupItem value="other" id="other" />
                            <FieldLabel htmlFor="other" className="font-normal">Other</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <RadioGroupItem value="none" id="none" />
                            <FieldLabel htmlFor="none" className="font-normal">Prefer not to say</FieldLabel>
                        </Field>
                    </RadioGroup>
                </FieldSet>
            </div>
        )
}