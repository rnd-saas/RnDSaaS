import Step1Nickname from "@/pages/Onboarding/steps/Step1Nickname.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import Step2Data from "@/pages/Onboarding/steps/Step2Data.tsx";
import Step4PrimaryGoal from "@/pages/Onboarding/steps/Step4PrimaryGoal.tsx";
import Step6DaysPerWeek from "@/pages/Onboarding/steps/Step6DaysPerWeek.tsx";
import Step7WhichDays from "@/pages/Onboarding/steps/Step7WhichDays.tsx";
import Step8SessionLength from "@/pages/Onboarding/steps/Step8SessionLength.tsx";
import Step9ProtectedAreas from "@/pages/Onboarding/steps/Step9ProtectedAreas.tsx";
import Step10WorkoutType from "@/pages/Onboarding/steps/Step10WorkoutType.tsx";
import Step11Emotions from "@/pages/Onboarding/steps/Step11Emotions.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {OnboardingPayload} from "@/lib/api";
import {useState} from "react";

export default function WorkoutPreferences(currentValues: OnboardingPayload){
        const [name, setName] = useState(currentValues?.preferredName)
    return(
        <div>
            <Input id="nickname" type="text" value={name}
                   onChange={(e) => {
                           setName(e.target.value);
                           console.log("stuff", currentValues)
                   }}/>
            <Separator/>
            {/*<Step2Data/>*/}
            {/*<Separator/>*/}
            {/*<Step4PrimaryGoal/>*/}
            {/*<Separator/>*/}
            {/*<Step6DaysPerWeek/>*/}
            {/*<Separator/>*/}
            {/*<Step7WhichDays/>*/}
            {/*<Separator/>*/}
            {/*<Step8SessionLength/>*/}
            {/*<Separator/>*/}
            {/*<Step9ProtectedAreas/>*/}
            {/*<Separator/>*/}
            {/*<Step10WorkoutType/>*/}
            {/*<Separator/>*/}
            {/*<Step11Emotions/>*/}
        </div>
    )
}