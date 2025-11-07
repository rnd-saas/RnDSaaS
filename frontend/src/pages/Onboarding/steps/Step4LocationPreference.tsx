import {Field, FieldDescription, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";


export default function Step4LocationPreference() {
    const [atHome, setAtHome] = useState(false);
    return (
        <div className="w-full max-w-md">
            <FieldSet>
                <FieldLabel>Location</FieldLabel>
                <FieldDescription>
                    Where do you prefer to train?
                </FieldDescription>
                <RadioGroup defaultValue="none">
                    <Field orientation="horizontal">
                        <RadioGroupItem onClick={() => setAtHome(false)} value="gym" id="gym" />
                        <FieldLabel htmlFor="gym" className="font-normal">At the gym</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <RadioGroupItem value="home" onClick={() => setAtHome(true)} id="home" />
                        <FieldLabel htmlFor="home" className="font-normal">At home</FieldLabel>
                    </Field>
                    {atHome &&(
                        <Field>
                            <FieldLabel htmlFor="equipment" className="font-normal">What type of equipment do you have at home?</FieldLabel>
                            <Input id="equipment" type="text"/>
                        </Field>
                    )}
                </RadioGroup>
            </FieldSet>
        </div>
    )
}