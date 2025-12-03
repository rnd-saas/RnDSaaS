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
            <Card className="w-[90vw] lg:min-w-[50vw] min-w-[70vw] hover:scale-none mx-auto">
                <div className="space-y-4 m-8">
                    <div className="grid gap-4
                            grid-cols-[repeat(auto-fit,minmax(20vw,1fr))]
                            md:grid-cols-[repeat(auto-fit,minmax(15vw,1fr))]
                            lg:grid-cols-[repeat(auto-fit,minmax(10vw,1fr))]"
                    >
                        {achievements.flat().map((a) => (
                            <Achievement key={a.id} {...a} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}