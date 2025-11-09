import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";
import {Controller, useFormContext} from "react-hook-form";

export default function Step1Data() {
    const { register, control } = useFormContext<Inputs>();

    return (
        <FieldSet>
            <FieldLegend>Your data</FieldLegend>
            <FieldDescription>
                What is your current data?
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="weight">Weight</FieldLabel>
                    <div className="flex items-center gap-2">
                        <Input id="weight" type="number" className="w-20"
                               {...register("weight", { required: "Weight value is required", valueAsNumber:true })}/>
                        <Controller name="weightUnit" control={control} defaultValue="kg" rules={{ required: "Weight unit is required" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">Kg</SelectItem>
                                        <SelectItem value="lbs">Lbs</SelectItem>
                                        <SelectItem value="st">St</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </Field>
                <Field>
                    <FieldLabel htmlFor="height">Height</FieldLabel>
                    <div className="flex items-center gap-2">
                        <Input id="height" type="number" className="w-20"
                               {...register("height", { required: "Height value is required", valueAsNumber:true })}/>
                        <Controller name="heightUnit" control={control} defaultValue="cm" rules={{ required: "Height unit is required" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cm">Cm</SelectItem>
                                        <SelectItem value="ft">Ft</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}