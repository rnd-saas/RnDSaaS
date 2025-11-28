import Achievement from "@/components/achievement.tsx";
import type { AchievementType } from "@/utils/AchievementType.tsx";

export default function AchievementList() {
  const recentAchievements: AchievementType[] = [
    {
      id: 1,
      title: "100 Workouts",
      sub: "Completed",
      image: "💪",
      obtained: true,
    },
    { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
    {
      id: 3,
      title: "Consecutive",
      sub: "Workout 12",
      image: "🔥",
      obtained: true,
    },
  ];

  return (
    <div className="flex items-stretch gap-3 overflow-x-auto justify-between pb-1">
      {recentAchievements.map((a) => (
        <Achievement key={a.id} {...a} />
      ))}
    </div>
  );
}
