import {useLocation} from "react-router-dom";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import {Label} from "@/components/ui/label.tsx";
import ChatbotButton from "@/components/chatbotButton.tsx";
import Goals from "@/pages/Progress/ProgressComponents/Goals.tsx";
import Moods from "@/pages/Progress/ProgressComponents/Moods.tsx";

export default function ProgressPage() {
    const progressComponents = [
        { value:"achievements", component: AchievementList, label: "Recent Achievements" },
        { value:"goals", component: Goals, label:"Your goals" },
        // { value:"moods", component: Moods, label:"This week's mood" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPlaceholder} />
                <AvatarFallback className="text-3xl">CN</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-semibold tracking-tight">{userName}</h2>
            <main>
                {progressComponents.map((g) => (
                    <div className={"mb-10"}>
                        <Label className={"my-5"}>{g.label}</Label>
                        <g.component />
                    </div>
                ))}
            </main>
            <ChatbotButton variant={"primary"}/>
        </div>
    )
}

