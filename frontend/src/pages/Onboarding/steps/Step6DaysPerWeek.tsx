import {FieldDescription, FieldLegend, FieldSet} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager";
import Step7WhichDays from "@/pages/Onboarding/steps/Step7WhichDays";


export default function Step6DaysPerWeek() {
    const { control, watch } = useFormContext<Inputs>();
    const selectedDays = watch("strDaysPerWeek");
    const hasSelectedDays = !!selectedDays;
    return (
        <div>
        <FieldSet  className="w-[60vw] lg:w-[30vw] lg:ml-[30vw] mb-10">
            <FieldLegend>Days per week</FieldLegend>
            <FieldDescription>
                How many days per week would you like to train?
            </FieldDescription>
            <div>
                <Controller control={control} name="strDaysPerWeek" defaultValue="" rules={{ required: "Please provide your preferred number of workout days" }}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the number of days"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </FieldSet>
            {hasSelectedDays && (
                <Step7WhichDays/>
            )}
        </div>
    )
}