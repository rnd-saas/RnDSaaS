import {useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

export default function Step1Nickname() {
    const { register} = useFormContext<Inputs>();

    return (
        <FieldSet className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldLegend>Nickname</FieldLegend>
            <FieldDescription>
                What would you like to be called?
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="nickname">Name:</FieldLabel>
                    <Input id="nickname" type="text"
                           {...register("nickname", { required: "Please provide a name" })}/>
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}