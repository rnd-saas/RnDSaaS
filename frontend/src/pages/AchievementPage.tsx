import { useEffect, useState } from "react";
import Achievement from "@/components/achievement.tsx";
import BackButton from "@/components/backButton.tsx";
import { Card } from "@/components/card.tsx";
import { profileService, type ProfileAchievement, ApiError } from "@/lib/api";
import { useLocation } from "react-router-dom";

export default function AchievementPage() {
    const location = useLocation();
    const [achievements, setAchievements] = useState<ProfileAchievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadAchievements = async () => {
            try {
                setError(null);
                setIsLoading(true);
                const data = await profileService.getAllAchievements();
                if (!active) return;
                setAchievements(data.achievements);
            } catch (err) {
                if (!active) return;
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("无法加载成就列表");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadAchievements();

        return () => {
            active = false;
        };
    }, [location.pathname]); // Reload when route changes (e.g., after login)

    return (
        <div>
            <header className="px-6 pt-11 pb-4">
                <div className="flex items-center justify-between">
                    <BackButton />
                </div>
            </header>
            <Card className="w-full max-w-lg lg:min-w-[50vw] min-w-[90vw] py-4">
                <div className="space-y-4 p-10 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                    {isLoading ? (
                        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-32 rounded-xl bg-muted animate-pulse"
                                />
                            ))}
                        </div>
                    ) : achievements.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            还没有获得任何成就
                        </p>
                    ) : (
                        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                            {achievements.map((a) => (
                                <Achievement
                                    key={a.id}
                                    title={a.title}
                                    sub={a.sub}
                                    image={a.emoji}
                                    obtained={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}