import {useForm, FormProvider} from "react-hook-form"
import { useNavigate } from "react-router-dom";
import {useState, useEffect, type ComponentType} from "react";
import FormProgress from "./FormProgress";
import StepNavigator from "./StepNavigator";

import Step0Welcome from "./steps/Step0Welcome";
import Step5Experience from "./steps/Step5Experience";
import Step6DaysPerWeek from "@/pages/Onboarding/steps/Step6DaysPerWeek";
import Step8SessionLength from "@/pages/Onboarding/steps/Step8SessionLength";
import Step9ProtectedAreas from "@/pages/Onboarding/steps/Step9ProtectedAreas";
import Step10WorkoutType from "@/pages/Onboarding/steps/Step10WorkoutType";
import Step11Emotions from "@/pages/Onboarding/steps/Step11Emotions";
import Step3Gender from "@/pages/Onboarding/steps/Step3Gender";
import Step2Data from "@/pages/Onboarding/steps/Step2Data";
import Step4PrimaryGoal from "./steps/Step4PrimaryGoal";
import type {PrimaryGoal} from "@/utils/InputTypes";
import type {Gender, GymComfortLevel, PreferredSplit} from "@/utils/InputTypes";
import Step1Nickname from "@/pages/Onboarding/steps/Step1Nickname";
import { onboardingService } from "@/lib/api";
import type { OnboardingPayload } from "@/lib/api";
import { trackOnboardingStep, trackOnboardingComplete, trackFormSubmit, trackError } from "@/lib/analytics";
import { useAchievements } from "@/lib/hooks/useAchievements";

const POUNDS_TO_KG = 0.45359237;
const STONES_TO_KG = 6.35029318;
const FEET_TO_CM = 30.48;

const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
};

const convertWeightToKg = (weight: number | undefined, unit: string | undefined): number | null => {
    if (weight === undefined || weight === null) return null;
    if (!Number.isFinite(weight)) return null;

    switch (unit) {
    case "kg":
        return roundToTwoDecimals(weight);
    case "lbs":
        return roundToTwoDecimals(weight * POUNDS_TO_KG);
    case "st":
        return roundToTwoDecimals(weight * STONES_TO_KG);
    default:
        return roundToTwoDecimals(weight);
    }
};

const convertHeightToCm = (height: number | undefined, unit: string | undefined): number | null => {
    if (height === undefined || height === null) return null;
    if (!Number.isFinite(height)) return null;

    switch (unit) {
    case "cm":
        return roundToTwoDecimals(height);
    case "ft":
        return roundToTwoDecimals(height * FEET_TO_CM);
    default:
        return roundToTwoDecimals(height);
    }
};

const toNumberOrNull = (value: string | number | undefined): number | null => {
    if (value === undefined || value === null) return null;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const toNumberArrayOrNull = (values: string[] | undefined): number[] | null => {
    if (!values || values.length === 0) return null;
    const numbers = values
        .map((value) => Number(value))
        .filter((num): num is number => Number.isFinite(num));
    return numbers.length ? numbers : null;
};

const normalizeString = (value: string | undefined): string | null => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : null;
};

const toEnumValue = (value: string | null | undefined): string | null => {
    if (!value) return null;

    const mappings: Record<string, string> = {
        'fat-loss': 'fat_loss',
        'muscle-gain': 'muscle_gain',
        strength: 'strength',
        endurance: 'endurance',
        mobility: 'mobility',
        'general-fitness': 'general_fitness',
        'full-body': 'full_body',
        'upper-lower': 'upper_lower',
        'push-pull-legs': 'push_pull_legs',
        other: 'other',
        'dont-know': 'dont_know',
        anxious: 'anxious_insecure',
        nervous: 'nervous',
        fine: 'mostly_fine',
        comfortable: 'comfortable',
        'never-been': 'never_been',
    };

    return mappings[value] ?? value.replace(/-/g, '_');
};

const mapGenderToDbValue = (gender: Gender | undefined): string | null => {
    return toEnumValue(gender);
};

const mapSelectionArrayToEnums = (values: string[] | undefined): string[] | null => {
    if (!values || values.length === 0) return null;
    const mapped = values
        .map((value) => toEnumValue(value))
        .filter((value): value is string => Boolean(value));
    return mapped.length ? mapped : null;
};

const mapComfortLevelsToDbValues = (
    comfortLevels: GymComfortLevel | GymComfortLevel[] | undefined
): string[] | null => {
    if (!comfortLevels) return null;
    const values = Array.isArray(comfortLevels) ? comfortLevels : [comfortLevels];
    return mapSelectionArrayToEnums(values);
};

const mapPrimaryGoalToDbValues = (goal: PrimaryGoal | undefined): string[] | null => {
    const normalized = toEnumValue(goal);
    return normalized ? [normalized] : null;
};

const mapPreferredSplitToDbValues = (
    split: PreferredSplit | PreferredSplit[] | undefined
): string[] | null => {
    if (!split) return null;
    const values = Array.isArray(split) ? split : [split];
    return mapSelectionArrayToEnums(values);
};

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
    preferredSplit:PreferredSplit[],
    comfortLevel:GymComfortLevel[],
    emotions:string[],
}
export default function OnboardingManager() {
    const [formStep, setStep] = useState(0);
    const methods = useForm<Inputs>({
        mode: "onChange",
        reValidateMode: "onChange",
    });
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { isSubmitting } = methods.formState;
    const { triggerCheck } = useAchievements();
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
            fields: ["strDaysPerWeek", "strAvailableDays"]
        },
        // {
        //     component: Step7WhichDays,
        //     fields: ["strAvailableDays"]
        // },
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
            component: Step11Emotions,
            fields: ["emotions"]
        },
    ];
    const totalSteps=stepComponents.length-1;
    const CurrentStep = stepComponents[formStep].component;

    // Step names for tracking
    const stepNames = [
        'welcome',
        'nickname',
        'data',
        'gender',
        'primary_goal',
        'experience',
        'days_per_week',
        'which_days',
        'session_length',
        'protected_areas',
        'workout_type',
        'comfort_level',
        'emotions'
    ];

    // Track step changes
    useEffect(() => {
        if (formStep < stepNames.length) {
            trackOnboardingStep(formStep, stepNames[formStep]);
        }
        const { fields } = stepComponents[formStep];
        methods.trigger(fields);
    }, [formStep]);

    const next = async () => {
        const { fields } = stepComponents[formStep];
        const valid = await methods.trigger(fields);
        if (!valid) return;
        const nextStep = formStep + 1;
        setStep(nextStep);
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

    const onSubmit = async (data: Inputs) => {
        setSubmitError(null);

        const selectedTrainerId = Number(data.strTrainer) === 1 ? 1 : 0;

        const trainerPreference = selectedTrainerId === 1;

        const payload: OnboardingPayload = {
            preferredName: normalizeString(data.nickname),
            gender: mapGenderToDbValue(data.gender),
            heightCm: convertHeightToCm(data.height, data.heightUnit),
            weightKg: convertWeightToKg(data.weight, data.weightUnit),
            primaryGoal: mapPrimaryGoalToDbValues(data.goal),
            trainingDaysPerWeek: toNumberOrNull(data.strDaysPerWeek),
            availableDays: toNumberArrayOrNull(data.strAvailableDays),
            sessionDuration: toNumberOrNull(data.strSessionDuration),
            problemAreas: data.problemAreas?.length ? data.problemAreas : null,
            preferredSplit: mapPreferredSplitToDbValues(data.preferredSplit),
            gymComfortLevel: mapComfortLevelsToDbValues(data.comfortLevel),
            experienceLevel: toNumberOrNull(data.strExperience),
            trainerId: selectedTrainerId,
            trainer: trainerPreference
        };

        try {
            console.log("Submitting onboarding payload", payload);
            await onboardingService.saveResponses(payload);
            console.log("Onboarding payload saved");

            const trainerId = selectedTrainerId;
            const firstName = normalizeString(data.nickname) ?? "Friend";
            const analyticsPrimaryGoal = payload.primaryGoal?.[0] ?? undefined;
            const analyticsExperienceLevel = payload.experienceLevel ?? undefined;

            // Track successful onboarding completion
            trackOnboardingComplete({
                trainerId: trainerId,
                primaryGoal: analyticsPrimaryGoal,
                experienceLevel: analyticsExperienceLevel
            });
            trackFormSubmit('onboarding', true);

            // Trigger achievement check for onboarding completion
            console.log("Triggering achievement check for onboarding_complete...");
            await triggerCheck({ type: 'onboarding_complete' });
            console.log("Achievement check completed.");

            try {
                localStorage.setItem("trainerId", String(trainerId));
                localStorage.setItem("firstName", firstName);
            } catch (storageErr) {
                console.warn("Failed to persist onboarding context", storageErr);
            }

            navigate("/landing", { state: { trainerId, firstName } });
        } catch (error: any) {
            console.error("Failed to save onboarding responses", error);
            trackFormSubmit('onboarding', false);
            trackError(error?.message ?? "Failed to save onboarding responses", 'OnboardingManager');
            setSubmitError(error?.message ?? "Failed to save your onboarding responses. Please try again.");
        }
    };

    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);
    const currentStepHasErrors = getStepErrors(formStep).length > 0;
    return (
        <FormProvider {...methods}>
            <div className="flex items-center justify-center p-4">
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="w-full max-w-md h-[95vh] min-w-[75vw] flex flex-col items-center gap-6"
                >
                    <div className="w-full p-2">
                        <FormProgress
                            currentStep={formStep}
                            totalSteps={stepComponents.length - 1}
                        />
                    </div>

                    <div className="w-[90vw] flex justify-start ml-10 mb-[10vh]">
                        <CurrentStep/>
                    </div>

                    <div className="p-4">
                        {getStepErrors(formStep).map((error, i) => (
                            <p key={i} className="text-primary">
                                {error?.message}
                            </p>
                        ))}
                        {submitError && (
                            <p className="text-primary">{submitError}</p>
                        )}
                    </div>
                    <div className="bg-white fixed bottom-0 w-[75vw] p-4 ">
                        <StepNavigator
                            prevStep={back}
                            nextStep={next}
                            prevDisabled={formStep == 0}
                            nextDisabled={currentStepHasErrors}
                            shouldSubmit={formStep == totalSteps}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </FormProvider>
);
}