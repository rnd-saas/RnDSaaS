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
import SettingsButton from "@/components/settingsButton.tsx";
import { Separator } from "@/components/ui/separator";
import {useEffect} from "react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: { firstName?: string } };
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fallbackName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    const location = useLocation();

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                setError(null);
                setIsLoading(true);
                const data = await profileService.getProfile();
                if (!active) return;
                console.log('[ProfilePage] Received profile data:', data);
                console.log('[ProfilePage] WorkoutGrid:', data.workoutGrid);
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
    }, [location.pathname]); // Reload when route changes (e.g., after login)

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

  useEffect(() => {
    window.tidioChatApi.show();
  }, []);
  return (
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 flex flex-col space-y-8 bg-background text-foreground font-sans">
      <header className="flex flex-col items-center space-y-4 relative py-4">
        <Avatar className="w-32 h-32 shadow-xl ring-4 ring-background">
            <AvatarImage src={profile?.user.avatarUrl ?? avatarPlaceholder} />
          <AvatarFallback className="text-3xl font-serif">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">
            {displayName}
        </h2>
        <div className="absolute top-0 right-0">
          <SettingsButton />
        </div>
      </header>
        <h2 className="text-3xl font-semibold tracking-tight">{displayName}</h2>
        {profile?.user.streakDays !== undefined && (
            <p className="text-sm text-muted-foreground">
                Current streak: {profile.user.streakDays} days
            </p>
        )}

        {error && (
            <p className="text-sm text-red-500">{error}</p>
        )}
      <main className="w-full space-y-12">
        {sections.map((g, index) => (
          <div
            key={g.key}
            className="animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards space-y-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold font-serif text-foreground/90 shrink-0">
                {g.label}
              </h3>
              <Separator className="flex-1 bg-border" />
            </div>

            <div className="px-1">
              <g.content/>
            </div>

            <div className="flex justify-center md:justify-start">
              <Button
                variant="outline"
                className="w-full md:w-auto min-w-[200px] h-10 font-medium"
                onClick={() => navigate(g.destination)}
              >
                {g.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-14 right-6 z-50">
        <div className="shadow-lg rounded-full">
          <ChatbotButton variant={"default"} />
        </div>
      </div>
    </div>
  );
}
