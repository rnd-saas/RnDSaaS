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
            // Changed to grid-cols-3 to match the content layout
            <div className="grid grid-cols-3 gap-3 w-full pb-1 px-1">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="h-32 w-full rounded-xl bg-muted animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        // Switched from flex/overflow to grid-cols-3
        // This forces items to share width equally (33% each) without scrolling
        <div className="grid grid-cols-3 gap-3 w-full pb-1 px-1">
            {displayAchievements.map((a) => (
                <Achievement 
                    key={a.id} 
                    title={a.title}
                    sub={a.sub}
                    image={a.emoji}
                    obtained={true}
                    // Removed fixed width (w-[100px]) and shrink-0
                    // Added w-full to fill the grid cell
                    // Kept md:h-[220px] for desktop height consistency
                    className="w-full h-full md:h-[220px]"
                />
            ))}
        </div>
    );
}