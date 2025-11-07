import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";


export default function Step9ProtectedAreas() {
    const [other, setOther] = useState(false);
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend variant="label">Vulnerable areas</FieldLegend>
                <FieldDescription>
                    Are there any areas you want to protect that need to be taken into account?
                </FieldDescription>
                <FieldGroup className="gap-3">
                    <Field orientation="horizontal">
                        <Checkbox id="shoulders" value={"shoulders"}/>
                        <FieldLabel htmlFor="shoulders" className="font-normal">Shoulders</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="lower-back" value={"lower-back"}/>
                        <FieldLabel htmlFor="lower-back" className="font-normal">Lower back</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="knees" value={"knees"}/>
                        <FieldLabel htmlFor="knees" className="font-normal">Knees</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" >
                        <Checkbox id="other" onCheckedChange={() => setOther(!other)} />
                        <FieldLabel htmlFor="other" className="font-normal" >Other</FieldLabel>
                    </Field>
                    {other &&(
                        <Field orientation="vertical">
                            <FieldLabel htmlFor={"other-input"}>Which other areas? (separate by commas)</FieldLabel>
                            <Input id="other-input" type="text"/>
                        </Field>
                    )}
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}