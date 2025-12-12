import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager";
import {splitOptions} from "@/utils/SplitOptionLabels";


export default function Step10WorkoutType() {
    const { control } = useFormContext<Inputs>();
    return (
        <FieldGroup  className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldSet>
                <FieldLegend>Workout type</FieldLegend>
                <FieldDescription>
                    Which type of workouts would you like to do?
                </FieldDescription>
                <Controller
                    name="preferredSplit"
                    control={control}
                    defaultValue={[]}
                    rules={{
                        required: "Please select one option",
                    }}
                    render={({ field }) => {
                        // Handle array value since Inputs defines it as array
                        const value = Array.isArray(field.value) && field.value.length > 0 
                            ? field.value[0] 
                            : "";
                            
                        return (
                            <RadioGroup 
                                className="gap-3"
                                value={value} 
                                onValueChange={(val) => field.onChange([val])}
                            >
                                {splitOptions.map(split => (
                                    <Field key={split.value} orientation="horizontal">
                                        <RadioGroupItem id={split.value} value={split.value}/>
                                        <FieldLabel htmlFor={split.value} className="font-normal">{split.label}</FieldLabel>
                                    </Field>
                                ))}
                            </RadioGroup>
                        );
                    }}
                />
            </FieldSet>
        </FieldGroup>
    )
}