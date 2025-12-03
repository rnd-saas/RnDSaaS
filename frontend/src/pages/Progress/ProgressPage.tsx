import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import {Label} from "@/components/ui/label.tsx";
import ChatbotButton from "@/components/chatbotButton.tsx";
import Goals from "@/pages/Progress/ProgressComponents/Goals.tsx";
import Moods from "@/pages/Progress/ProgressComponents/Moods.tsx";
import Workouts from "@/pages/Progress/ProgressComponents/Workouts.tsx";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import PersonalData from "@/pages/Progress/ProgressComponents/PersonalData.tsx";
import { useEffect, useState } from "react";
import { profileService, type ProfileResponse } from "@/lib/api";

export default function ProgressPage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);

    useEffect(() => {
        profileService.getProfile().then(setProfile).catch(console.error);
    }, []);

    const progressComponents = [
        { value:"achievements", render: () => <AchievementList achievements={profile?.achievements ?? []} />, label: "Recent Achievements" },
        { value:"goals", render: () => <Goals />, label:"Your goals" },
        { value:"moods", render: () => <Moods />, label:"This week's mood" },
        { value:"workouts", render: () => <Workouts />, label:"This week's workouts" },
        { value:"calendar", render: () => <WorkoutDisplay weeks={profile?.workoutGrid} />, label:"Planned workouts" },
        { value:"data", render: () => <PersonalData />, label:"Your data" },
    ];

    return (
        <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
            <main>
                {progressComponents.map((g) => (
                    <div key={g.value} className={"mb-10"}>
                        <Label className={"my-5"}>{g.label}</Label>
                        {g.render()}
                    </div>
                ))}
            </main>
            <ChatbotButton variant={"primary"}/>
        </div>
    )
}

