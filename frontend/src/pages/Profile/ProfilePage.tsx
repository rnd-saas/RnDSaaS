import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarPlaceholder from "../../assets/avatars/tom_avatar.png";
import ChatbotButton from "@/components/chatbotButton";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {profileService, type ProfileResponse, ApiError, ProfileData, OnboardingPayload} from "@/lib/api";
import SettingsButton from "@/components/settingsButton";
import { Separator } from "@/components/ui/separator";
import {Progress} from "@/components/ui/progress";
import {GenderValues, GymComfortLevelValues, PreferredSplitValues, PrimaryGoalValues} from "@/utils/InputTypes";
import {AvatarOptionValues} from "@/utils/AvatarOptionValues";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import WorkoutPreferences from "@/pages/Profile/ProfileComponents/WorkoutPreferences";

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
    const [profileData, setProfileData] = useState<ProfileData | null>(
        null
    )

    const FALLBACK_PROFILE: ProfileData = {
        firstName: null,
        avatarOption: null,
        level: { label: "Novice", currentXp: 0, nextLevelXp: 1200 },
        onboarding: {
            preferredName: displayName,
            gender: GenderValues.PreferNotToSay,
            heightCm: 160,
            weightKg: 60,
            primaryGoal: [PrimaryGoalValues.GeneralFitness],
            trainingDaysPerWeek:1,
            availableDays: [1],
            sessionDuration: 60,
            problemAreas: null,
            preferredSplit: [PreferredSplitValues.DontKnow],
            gymComfortLevel: [GymComfortLevelValues.Enthusiastic],
            experienceLevel: 1,
            trainerId: 1,
            trainer:true
        }
    };
    const resolvedData = profileData ?? FALLBACK_PROFILE;
    // Use level from API if available, otherwise use fallback
    const level = profile?.level ?? resolvedData.level;
    const avatarOption = resolvedData.avatarOption;
    const onboardingResults = resolvedData.onboarding;

    const sections = [
        {
            key: "level",
            label: "Current level",
            content: (
                <div className="flex flex-col items-end gap-1 min-w-[150px]">
                    <div className="flex items-center justify-between w-full text-xs">
              <span className="text-muted-foreground">
                Level:{" "}
                  <span className="font-medium text-foreground">
                  {level.label}
                </span>
              </span>
                        <span className="text-muted-foreground">
                {level.currentXp} / {level.nextLevelXp} XP
              </span>
                    </div>
                    <Progress
                        value={(level.currentXp / level.nextLevelXp) * 100}
                        className="h-2 w-full"
                    />
                </div>
            ),
        },
        // {
        //     key: "onboarding",
        //     label: "Workout preferences",
        //     content: (
        //         <WorkoutPreferences currentValues={onboardingResults}/>
        //     ),
        // },
    ];

    useEffect(() => {
        window.tidioChatApi.show();
    }, []);
    return (
        <div
            className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 flex flex-col space-y-8 bg-background text-foreground font-sans">
            <header className="flex flex-col items-center space-y-4 relative py-4">
                <Dialog>
                    <DialogTrigger>
                        <Avatar className="w-32 h-32 shadow-xl ring-4 ring-background">
                            <AvatarImage src={AvatarOptionValues[avatarOption] ?? avatarPlaceholder}/>
                            <AvatarFallback
                                className="text-3xl font-serif">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Choose a profile image</DialogTitle>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">
            {displayName}
        </h2>
        <div className="absolute top-0 right-0">
          <SettingsButton />
        </div>
      </header>
        {profile?.user.streakDays !== undefined && (
            <h1>
                Current streak: {profile.user.streakDays} days
            </h1>
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
                {g.content}
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
