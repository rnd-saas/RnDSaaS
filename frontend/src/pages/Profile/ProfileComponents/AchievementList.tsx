import Achievement from "@/components/achievement";

type AchievementListItem = {
    id: string;
    title: string;
    sub: string;
    emoji: string;
};

type AchievementListProps = {
    achievements: AchievementListItem[];
    isLoading?: boolean;
};

const FALLBACK_ACHIEVEMENTS: AchievementListItem[] = [
    // { id: "fallback-1", title: "100 Workouts", sub: "Completed", emoji: "💪" },
    // { id: "fallback-2", title: "7 Days", sub: "Streak", emoji: "📆" },
    // { id: "fallback-3", title: "Consecutive", sub: "Workout 12", emoji: "🔥" },
];

export default function AchievementList({ achievements, isLoading }: AchievementListProps) {
    const displayAchievements =
        achievements && achievements.length > 0 ? achievements : FALLBACK_ACHIEVEMENTS;

    if (isLoading && achievements.length === 0) {
        return (
            <div className="flex items-stretch gap-3 overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 w-full justify-center pb-1 px-1">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="h-32 w-[110px] md:w-full shrink-0 rounded-xl bg-muted animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-stretch gap-3 overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 w-full justify-center pb-1 px-1">
            {displayAchievements.map((a) => (
                <Achievement 
                    key={a.id} 
                    title={a.title}
                    sub={a.sub}
                    image={a.emoji}
                    obtained={true}
                    // Mobile: Fixed width (120px) for scrolling
                    // Desktop: Full width, fixed height (~280px) to match the Mood card neighbor
                    className="flex-1 md:w-full shrink-0 md:shrink md:h-[280px]"
                />
            ))}
        </div>
    );
}