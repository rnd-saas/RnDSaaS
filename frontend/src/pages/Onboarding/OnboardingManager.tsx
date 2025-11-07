import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import FormProgress from "./FormProgress.tsx";
import StepNavigator from "./StepNavigator.tsx";

import Step1Welcome from "./steps/Step1Welcome.tsx";
import Step2PrimaryGoal from "./steps/Step2PrimaryGoal.tsx";
import Step3Experience from "./steps/Step3Experience.tsx";
import Step4LocationPreference from "@/pages/Onboarding/steps/Step4LocationPreference.tsx";
import Step5DaysPerWeek from "@/pages/Onboarding/steps/Step5DaysPerWeek.tsx";
import Step6WhichDays from "@/pages/Onboarding/steps/Step6WhichDays.tsx";
import Step7SessionLength from "@/pages/Onboarding/steps/Step7SessionLength.tsx";
import Step8ProtectedAreas from "@/pages/Onboarding/steps/Step8ProtectedAreas.tsx";
import Step9WorkoutType from "@/pages/Onboarding/steps/Step9WorkoutType.tsx";
import Step10ComfortLevel from "@/pages/Onboarding/steps/Step10ComfortLevel.tsx";
import Step11Gender from "@/pages/Onboarding/steps/Step11Gender.tsx";
import Step12Data from "@/pages/Onboarding/steps/Step12Data.tsx";

export default function OnboardingManager() {
    const [formStep, setStep] = useState(0);
    const methods = useForm()
    const stepComponents = [
        Step1Welcome,
        Step2PrimaryGoal,
        Step3Experience,
        Step4LocationPreference,
        Step5DaysPerWeek,
        Step6WhichDays,
        Step7SessionLength,
        Step8ProtectedAreas,
        Step9WorkoutType,
        Step10ComfortLevel,
        Step11Gender,
        Step12Data,
    ];
    const totalSteps=stepComponents.length-1;
    const CurrentStep = stepComponents[formStep];

    const next = () => {
        setStep((s) => {
            const newStep = s + 1;
            console.log("step:", newStep);
            return newStep;
        });
    };

    const back = () => {
        setStep((s) => {
            const newStep = s - 1;
            console.log("step:", newStep);
            return newStep;
        });
    };


    const onSubmit = (data) => {
        //todo: need to ensure data is available and save the data somewhere
        console.log("submit clicked");
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-md min-h-[75vh] min-w-[40vw]">
                <div className="sticky top-0 p-4 ">
                    <FormProgress currentStep={formStep} totalSteps={stepComponents.length - 1} />
                </div>
                <CurrentStep />
                {/*todo: need to check data was filled in before allowing next button*/}
                <div className="fixed w-[40vw] bottom-[20vh] p-4" >
                    <StepNavigator prevStep={back} nextStep={next} prevDisabled={formStep==0} nextDisabled={formStep==totalSteps}/>
                    {formStep==totalSteps && <Button>Submit</Button>}
                </div>
            </form>
        </FormProvider>
    )
}