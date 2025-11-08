import { useForm, FormProvider} from "react-hook-form"
import {useState} from "react";
import FormProgress from "./FormProgress.tsx";
import StepNavigator from "./StepNavigator.tsx";

import Step0Welcome from "./steps/Step0Welcome.tsx";
import Step4Experience from "./steps/Step4Experience.tsx";
import Step6DaysPerWeek from "@/pages/Onboarding/steps/Step6DaysPerWeek.tsx";
import Step7WhichDays from "@/pages/Onboarding/steps/Step7WhichDays.tsx";
import Step8SessionLength from "@/pages/Onboarding/steps/Step8SessionLength.tsx";
import Step9ProtectedAreas from "@/pages/Onboarding/steps/Step9ProtectedAreas.tsx";
import Step10WorkoutType from "@/pages/Onboarding/steps/Step10WorkoutType.tsx";
import Step11ComfortLevel from "@/pages/Onboarding/steps/Step11ComfortLevel.tsx";
import Step2Gender from "@/pages/Onboarding/steps/Step2Gender.tsx";
import Step1Data from "@/pages/Onboarding/steps/Step1Data.tsx";
import Step3PrimaryGoal from "./steps/Step3PrimaryGoal.tsx";
import type {PrimaryGoal} from "@/utils/InputTypes.tsx";
import {Gender, GymComfortLevel, PreferredSplit} from "@/utils/InputTypes.tsx";

export type Inputs = {
    strTrainer:string,
    weight:number,
    weightUnit:string,
    height:number,
    heightUnit:string,
    gender:Gender,
    goal:PrimaryGoal,
    strExperience:string,
    strDaysPerWeek:string,
    strAvailableDays:string[],
    strSessionDuration:string,
    problemAreas:string[],
    preferredSplit:PreferredSplit,
    comfortLevel:GymComfortLevel,
}
export default function OnboardingManager() {
    const [formStep, setStep] = useState(0);
    const methods = useForm<Inputs>()

    const stepComponents = [
        Step0Welcome,
        Step1Data,
        Step2Gender,
        Step3PrimaryGoal,
        Step4Experience,
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
        const stepValues = methods.getValues();
        console.log("Saving step data:", stepValues);
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


    const onSubmit = (data:Inputs) => {
        const trainer = { trainer: Number(data.strTrainer) };
        const experience = {experience: Number(data.strExperience)};
        const daysPerWeek= { daysPerWeek: Number(data.strDaysPerWeek) };
        const availableDays = {availableDays: data.strAvailableDays.map(Number),};
        const sessionDuration= { sessionDuration: Number(data.strSessionDuration) };
        console.log("submit clicked", trainer, experience, daysPerWeek, availableDays, sessionDuration);
    }

    return (
        <FormProvider {...methods}>
            <div className="flex items-center justify-center p-4">
                <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-md min-h-[75vh] min-w-[75vw]">
                    <div className="absolute top-0 left-0 w-full p-2">
                        <FormProgress currentStep={formStep} totalSteps={stepComponents.length - 1}/>
                    </div>
                    <div className="w-full flex justify-center">
                        <CurrentStep/>
                    </div>
                    {/*todo: need to check data was filled in before allowing next button*/}
                    <div className="fixed w-[75vw] bottom-[10vh] p-4">
                        <StepNavigator prevStep={back} nextStep={next} prevDisabled={formStep == 0}
                                       nextDisabled={formStep == totalSteps}/>
                    </div>
                </form>
            </div>
        </FormProvider>
)
}