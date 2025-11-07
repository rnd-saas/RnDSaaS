import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import FormProgress from "./FormProgress.tsx";
import StepNavigator from "./StepNavigator.tsx";

import Step0Welcome from "./steps/Step0Welcome.tsx";
import Step4Experience from "./steps/Step4Experience.tsx";
import Step5LocationPreference from "@/pages/Onboarding/steps/Step5LocationPreference.tsx";
import Step6DaysPerWeek from "@/pages/Onboarding/steps/Step6DaysPerWeek.tsx";
import Step7WhichDays from "@/pages/Onboarding/steps/Step7WhichDays.tsx";
import Step8SessionLength from "@/pages/Onboarding/steps/Step8SessionLength.tsx";
import Step9ProtectedAreas from "@/pages/Onboarding/steps/Step9ProtectedAreas.tsx";
import Step10WorkoutType from "@/pages/Onboarding/steps/Step10WorkoutType.tsx";
import Step11ComfortLevel from "@/pages/Onboarding/steps/Step11ComfortLevel.tsx";
import Step2Gender from "@/pages/Onboarding/steps/Step2Gender.tsx";
import Step1Data from "@/pages/Onboarding/steps/Step1Data.tsx";
import Step3PrimaryGoal from "./steps/Step3PrimaryGoal.tsx";

export default function OnboardingManager() {
    const [formStep, setStep] = useState(0);
    const methods = useForm()
    const stepComponents = [
        Step0Welcome,
        Step1Data,
        Step2Gender,
        Step3PrimaryGoal,
        Step4Experience,
        Step5LocationPreference,
        Step6DaysPerWeek,
        Step7WhichDays,
        Step8SessionLength,
        Step9ProtectedAreas,
        Step10WorkoutType,
        Step11ComfortLevel,
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
            <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-md min-h-[75vh] min-w-[75vw]">
                <div className="sticky top-0 p-4 ">
                    <FormProgress currentStep={formStep} totalSteps={stepComponents.length - 1} />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <CurrentStep />
                </div>
                {/*todo: need to check data was filled in before allowing next button*/}
                <div className="fixed w-[75vw] bottom-[20vh] p-4" >
                    <StepNavigator prevStep={back} nextStep={next} prevDisabled={formStep==0} nextDisabled={formStep==totalSteps}/>
                    {formStep==totalSteps && <Button>Submit</Button>}
                </div>
            </form>
        </FormProvider>
    )
}