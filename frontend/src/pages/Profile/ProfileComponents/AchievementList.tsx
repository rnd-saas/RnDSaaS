import Achievement from "@/components/achievement.tsx";

export default function AchievementList() {

    const recentAchievements = [
        { id: 1, title: "100 Workouts", sub: "Completed", emoji: "💪" },
        { id: 2, title: "7 Days", sub: "Streak", emoji: "📆" },
        { id: 3, title: "Consecutive", sub: "Workout 12", emoji: "🔥" },
    ];

    return (
        <div className="flex items-stretch gap-3 overflow-x-auto justify-center pb-1">
            {recentAchievements.map((a) => (
                <Achievement key={a.id} {...a} />
            ))}
        </div>
    );
}