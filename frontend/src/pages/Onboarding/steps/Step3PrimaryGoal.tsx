import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {PrimaryGoal} from "@/utils/InputTypes.tsx";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";


export default function Step3PrimaryGoal() {
    const { control } = useFormContext<Inputs>();
    const goalOptions: { value: PrimaryGoal; label: string }[]  = [
        { value: PrimaryGoal.MuscleGain, label: "Build muscle" },
        { value: PrimaryGoal.FatLoss, label:"Lose fat" },
        { value: PrimaryGoal.Endurance, label: "Improve endurance" },
        { value: PrimaryGoal.Strength, label: "Get stronger" },
        { value: PrimaryGoal.Mobility, label: "Improve mobility" },
        { value: PrimaryGoal.GeneralFitness, label: "Just get active and consistent" },
    ];
    return (
        <FieldSet>
            <FieldLegend >Primary Goal</FieldLegend>
            <FieldDescription>
                What is your primary goal right now?
            </FieldDescription>
            <Controller control={control} name="goal" defaultValue="" rules={{ required: true }}
                render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                        {goalOptions.map((g) => (
                            <Field key={g.value} orientation="horizontal">
                                <RadioGroupItem value={g.value} id={g.value} />
                                <FieldLabel htmlFor={g.value} className="font-normal">
                                    {g.label}
                                </FieldLabel>
                            </Field>
                        ))}
                    </RadioGroup>
                )}
            />
        </FieldSet>
    )
}