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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        profileService.getProfile()
            .then((data) => {
                if (mounted) {
                    setProfile(data);
                }
            })
            .catch((err) => {
                console.error('Failed to load profile:', err);
                if (mounted) {
                    setError('Failed to load profile data');
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });
        
        return () => {
            mounted = false;
        };
    }, []);

    const progressComponents = [
        { value:"achievements", render: () => {
            try {
                return <AchievementList achievements={profile?.achievements ?? []} />;
            } catch (error) {
                console.error('Error rendering achievements:', error);
                return <div className="text-sm text-red-500">Error loading achievements</div>;
            }
        }, label: "Recent Achievements" },
        { value:"goals", render: () => {
            try {
                return <Goals />;
            } catch (error) {
                console.error('Error rendering goals:', error);
                return <div className="text-sm text-red-500">Error loading goals</div>;
            }
        }, label:"Your goals" },
        { value:"moods", render: () => {
            try {
                return <Moods />;
            } catch (error) {
                console.error('Error rendering moods:', error);
                return <div className="text-sm text-red-500">Error loading moods</div>;
            }
        }, label:"This week's mood" },
        { value:"workouts", render: () => {
            try {
                return <Workouts />;
            } catch (error) {
                console.error('Error rendering workouts:', error);
                return <div className="text-sm text-red-500">Error loading workouts</div>;
            }
        }, label:"This week's workouts" },
        { value:"calendar", render: () => {
            try {
                return <WorkoutDisplay weeks={profile?.workoutGrid} />;
            } catch (error) {
                console.error('Error rendering calendar:', error);
                return <div className="text-sm text-red-500">Error loading calendar</div>;
            }
        }, label:"Planned workouts" },
        { value:"data", render: () => {
            try {
                return <PersonalData />;
            } catch (error) {
                console.error('Error rendering personal data:', error);
                return <div className="text-sm text-red-500">Error loading personal data</div>;
            }
        }, label:"Your data" },
    ];

    if (loading) {
        return (
            <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

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

