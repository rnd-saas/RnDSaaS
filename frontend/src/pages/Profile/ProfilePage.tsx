import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/tom_avatar.png";
import ChatbotButton from "@/components/chatbotButton.tsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { profileService, type ProfileResponse, ApiError } from "@/lib/api";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: { firstName?: string } };
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fallbackName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                setError(null);
                const data = await profileService.getProfile();
                if (!active) return;
                setProfile(data);
            } catch (err) {
                if (!active) return;
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("无法加载个人资料");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const displayName = profile?.user.preferredName ?? fallbackName;

    const sections = [
        {
            key: "achievements",
            label: "Recent Achievements:",
            buttonText: "See More",
            destination: "/achievements",
            content: (
                <AchievementList
                    achievements={profile?.achievements?.slice(0, 3) ?? []}
                    isLoading={isLoading}
                />
            ),
        },
        {
            key: "recent-workouts",
            label: "Recent Workouts:",
            buttonText: "See Full List",
            destination: "/calendar",
            content: (
                <WorkoutDisplay
                    weeks={profile?.workoutGrid}
                    isLoading={isLoading}
                />
            ),
        },
    ];

    return (
        <div className="w-full max-w-md min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.user.avatarUrl ?? avatarPlaceholder} />
                <AvatarFallback className="text-3xl">
                    {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <h2 className="text-3xl font-semibold tracking-tight">{displayName}</h2>
            {profile?.user.streakDays !== undefined && (
                <p className="text-sm text-muted-foreground">
                    Current streak: {profile.user.streakDays} days
                </p>
            )}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <main className="w-full">
                {sections.map((section) => (
                    <div key={section.key} className="m-6 flex flex-col items-center">
                        <Label className="w-full mb-3">{section.label}</Label>
                        {section.content}
                        <Button
                            className="h-6 w-[75vw] md:w-[40vw] lg:w-[20vw] m-2"
                            onClick={() => navigate(section.destination)}
                            variant="secondary"
                        >
                            {section.buttonText}
                        </Button>
                    </div>
                ))}
            </main>

            <ChatbotButton variant={"primary"} />
        </div>
    );
}

