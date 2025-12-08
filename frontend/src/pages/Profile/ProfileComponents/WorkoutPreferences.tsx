import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
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