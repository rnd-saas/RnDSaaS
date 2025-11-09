import {useForm, FormProvider} from "react-hook-form"
import {useState, type ComponentType} from "react";
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
    const methods = useForm<Inputs>();

    type Step = {
        component: ComponentType;
        fields: (keyof Inputs)[];
    };

    const stepComponents: Step[] = [
        {
            component: Step0Welcome,
            fields: ["strTrainer"]
        },
        {
            component: Step1Data,
            fields: ["weight", "weightUnit", "height", "heightUnit"]
        },
        {
            component: Step2Gender,
            fields: ["gender"]
        },
        {
            component: Step3PrimaryGoal,
            fields: ["goal"]
        },
        {
            component: Step4Experience,
            fields: ["strExperience"]
        },
        {
            component: Step6DaysPerWeek,
            fields: ["strDaysPerWeek"]
        },
        {
            component: Step7WhichDays,
            fields: ["strAvailableDays"]
        },
        {
            component: Step8SessionLength,
            fields: ["strSessionDuration"]
        },
        {
            component: Step9ProtectedAreas,
            fields: ["problemAreas"]
        },
        {
            component: Step10WorkoutType,
            fields: ["preferredSplit"]
        },
        {
            component: Step11ComfortLevel,
            fields: ["comfortLevel"]
        },
    ];

    const totalSteps=stepComponents.length-1;
    const CurrentStep = stepComponents[formStep].component;

    const next = async () => {
        const stepValues = methods.getValues();
        console.log("Saving step data:", stepValues);
        const { fields } = stepComponents[formStep];
        const valid = await methods.trigger(fields);
        if (!valid) return;
        setStep((s) => s + 1);
    };

    const back = () => {
        setStep((s) => s - 1);
    };

    const getStepErrors = (stepIndex: number) => {
        const step = stepComponents[stepIndex];
        return step.fields
            .map((f) => methods.formState.errors[f])
            .filter(Boolean);
    };

    const onSubmit = (data:Inputs) => {
        const trainer = { trainer: Number(data.strTrainer) };
        const experience = {experience: Number(data.strExperience)};
        const daysPerWeek= { daysPerWeek: Number(data.strDaysPerWeek) };
        const availableDays = {availableDays: data.strAvailableDays.map(Number),};
        const sessionDuration= { sessionDuration: Number(data.strSessionDuration) };
        console.log("submit clicked", trainer, experience, daysPerWeek, availableDays, sessionDuration);
        alert("onboarding completed");
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
                    <div className={"p-4"}>
                        {getStepErrors(formStep).map((error, i) => (
                            <p key={i} className="text-[var(--intuitive-names-error-message)]">
                                {error?.message}
                            </p>
                        ))}
                    </div>
                    <div className="fixed w-[75vw] bottom-[10vh] p-4">
                        <StepNavigator prevStep={back} nextStep={next} prevDisabled={formStep == 0} nextDisabled={formStep == totalSteps}/>
                    </div>
                </form>
            </div>
        </FormProvider>
)
}