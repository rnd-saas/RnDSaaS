import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import {Label} from "@/components/ui/label.tsx";
import ChatbotButton from "@/components/chatbotButton.tsx";
import Goals from "@/pages/Progress/ProgressComponents/Goals.tsx";
import Moods from "@/pages/Progress/ProgressComponents/Moods.tsx";
import Workouts from "@/pages/Progress/ProgressComponents/Workouts.tsx";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import PersonalData from "@/pages/Progress/ProgressComponents/PersonalData.tsx";

export default function ProgressPage() {
    const progressComponents = [
        { value:"achievements", component: AchievementList, label: "Recent Achievements" },
        { value:"moods", component: Moods, label:"This week's mood" },
        { value:"goals", component: Goals, label:"Your goals" },
        { value:"calendar", component: WorkoutDisplay, label:"Planned workouts" },
        { value:"data", component: PersonalData, label:"Your data" },
        { value:"workouts", component: Workouts, label:"This week's workouts" },
    ];

    return (
        <div className="w-[85vw] min-h-[75vh] flex flex-col items-center my-5 mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {progressComponents.map((g) => (
                    <div key={g.value} className="mb-5">
                        <Label className="my-5">{g.label}</Label>
                        <g.component/>
                    </div>
                ))}
            </main>
            <ChatbotButton variant="primary"/>
        </div>
    )
}

