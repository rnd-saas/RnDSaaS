import {useForm, FormProvider} from "react-hook-form"
import { useNavigate } from "react-router-dom";
import {useState, type ComponentType} from "react";
import FormProgress from "./FormProgress.tsx";
import StepNavigator from "./StepNavigator.tsx";

import Step0Welcome from "./steps/Step0Welcome.tsx";
import Step5Experience from "./steps/Step5Experience.tsx";
import Step6DaysPerWeek from "@/pages/Onboarding/steps/Step6DaysPerWeek.tsx";
import Step7WhichDays from "@/pages/Onboarding/steps/Step7WhichDays.tsx";
import Step8SessionLength from "@/pages/Onboarding/steps/Step8SessionLength.tsx";
import Step9ProtectedAreas from "@/pages/Onboarding/steps/Step9ProtectedAreas.tsx";
import Step10WorkoutType from "@/pages/Onboarding/steps/Step10WorkoutType.tsx";
import Step11ComfortLevel from "@/pages/Onboarding/steps/Step11ComfortLevel.tsx";
import Step3Gender from "@/pages/Onboarding/steps/Step3Gender.tsx";
import Step2Data from "@/pages/Onboarding/steps/Step2Data.tsx";
import Step4PrimaryGoal from "./steps/Step4PrimaryGoal.tsx";
import type {PrimaryGoal} from "@/utils/InputTypes.tsx";
import {Gender, GymComfortLevel, PreferredSplit} from "@/utils/InputTypes.tsx";
import Step1Nickname from "@/pages/Onboarding/steps/Step1Nickname.tsx";

export type Inputs = {
    strTrainer:string,
    nickname:string,
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
    const navigate = useNavigate();

    //defining all quiz steps
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
            component: Step1Nickname,
            fields: ["nickname"]
        },
        {
            component: Step2Data,
            fields: ["weight", "weightUnit", "height", "heightUnit"]
        },
        {
            component: Step3Gender,
            fields: ["gender"]
        },
        {
            component: Step4PrimaryGoal,
            fields: ["goal"]
        },
        {
            component: Step5Experience,
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

    //button logic
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
        const trainerId = Number(data.strTrainer); // 0 = Tom, 1 = Sarah
        const firstName = data.nickname;
        console.log("submit clicked", trainer, experience, daysPerWeek, availableDays, sessionDuration);
        alert("onboarding completed");
        try {
            localStorage.setItem("trainerId", String(trainerId)); // fallback for refresh/direct visit
            localStorage.setItem("firstName", firstName);
          } catch {}
          navigate("/landing", { state: { trainerId, firstName } });
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