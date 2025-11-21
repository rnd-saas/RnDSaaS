import type {AchievementType} from "@/utils/AchievementType.tsx";
import Achievement from "@/components/achievement.tsx";
import BackButton from "@/components/backButton.tsx";
import {Card} from "@/components/card.tsx";

export default function AchievementPage(){
    const achievements:AchievementType[][] = [//todo: get from database, maybe sorted to show obtained achievements first
        [
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
            { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
            { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
            { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
            { id: 4, title: "15 new exercises", sub: "Exercises 15", image: "🤷‍♂️", obtained:false },
        ]
    ];
    return (
        <div>
            <header className="px-6 pt-11 pb-4">
                <div className="flex items-center justify-between">
                    <BackButton/>
                </div>
            </header>
            <Card className="w-full max-w-lg lg:min-w-[50vw] min-w-[90vw] py-4">
                <div className="space-y-4 p-10">
                    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                        {achievements.flat().map((a) => (
                            <Achievement key={a.id} {...a} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}