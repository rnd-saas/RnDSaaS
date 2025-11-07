import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";


export default function Step3PrimaryGoal() {

    return (
        <FieldSet>
            <FieldLegend >Primary Goal</FieldLegend>
            <FieldDescription>
                What is your primary goal right now?
            </FieldDescription>
            <RadioGroup>
                <Field orientation="horizontal">
                    <RadioGroupItem value="lose-fat" id="lose-fat" />
                    <FieldLabel htmlFor="lose-fat" className="font-normal">Lose fat</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="build-muscle" id="build-muscle" />
                    <FieldLabel htmlFor="build-muscle" className="font-normal">Build muscle</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="get-stronger" id="get-stronger" />
                    <FieldLabel htmlFor="get-stronger" className="font-normal">Get stronger</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem value="active" id="active" />
                    <FieldLabel htmlFor="active" className="font-normal">Just get active and consistent</FieldLabel>
                </Field>
            </RadioGroup>
        </FieldSet>
    )
}