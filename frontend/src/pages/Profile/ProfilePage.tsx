import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/tom_avatar.png";
import ChatbotButton from "@/components/chatbotButton.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { authService } from "@/lib/api/authService";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        fetchUser();
    }, []);

    const profileComponents = [
        { value:"achivements", component: AchievementList, destination: "/achievements", buttonText:"See More", label: "Recent Achievements" },
        { value:"recent-workouts", component: WorkoutDisplay, destination: "/calendar", buttonText:"See Full List", label:"Recent Workouts" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = user?.display_name ?? state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPlaceholder} />
                <AvatarFallback className="text-3xl">CN</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-semibold tracking-tight">{userName}</h2>
            
            <main>
                {profileComponents.map((g) => (
                    <div className={"m-10"} key={g.value}>
                        <Label className={"my-5"}>{g.label}</Label>
                        <g.component />
                        <Button variant={"outline"} className={"h-6 w-full my-4 p-4"} onClick={() => navigate(g.destination)}>{g.buttonText}</Button>
                    </div>
                ))}
            </main>
            <ChatbotButton variant={"primary"}/>
        </div>
    )
}

