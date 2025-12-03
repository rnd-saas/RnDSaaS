import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import ChatbotButton from "@/components/chatbotButton.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import SettingsButton from "@/components/settingsButton.tsx";

export default function ProfilePage() {
    const navigate = useNavigate();
    const profileComponents = [
        { value:"achievements", component: AchievementList, destination: "/achievements", buttonText:"See More", label: "Recent Achievements" },
        { value:"recent-workouts", component: WorkoutDisplay, destination: "/calendar", buttonText:"See Full List", label:"Recent Workouts" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="min-h-[75vh] w-[45vw] flex flex-col items-center space-y-6 mx-auto">

            <header className="flex items-start justify-between">
                <div>
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={avatarPlaceholder}/>
                        <AvatarFallback className="text-3xl">CN</AvatarFallback>
                    </Avatar>
                    <h2 className="text-3xl font-semibold tracking-tight">{userName}</h2>
                </div>
                <div className="absolute top-4 right-4">
                    <SettingsButton/>
                </div>
            </header>

            <main>
                {profileComponents.map((g) => (
                    <div className={"mb-10"}>
                        <Label className={"my-5"}>{g.label}</Label>
                        <g.component/>
                        <Button variant={"outline"} className={"h-6 w-full my-4 p-4"}
                                onClick={() => navigate(g.destination)}>{g.buttonText}</Button>
                    </div>
                ))}
            </main>
            <ChatbotButton variant={"primary"}/>
        </div>
    )
}

