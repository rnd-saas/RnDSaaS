import {GoalRow} from "@/pages/DashboardPage.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export default function Goals(){
    //the idea is that the user has a list of all goals that are possible within the app and they can select whichever
    // they think is relevant to them.
    //When a new goal is added, progress can be 0 regardless of what they have done before to avoid storing unnecessary info
    //Goals can also be removed if user no longer wants to track it
    const possibleGoals = [
        { label: "Workouts completed", value: "workoutsCompleted", target: 5 },
        { label: "Exercises discovered", value: "exercisesDiscovered", target: 10 },
        { label: "Longest streak", value: "longestStreak", target: 7 },
        { label: "Moods logged", value: "moodsLogged", target: 7 },
        { label: "Liked friends' posts", value: "likedFriendsPosts", target: 10 },
    ];
    const selectedGoals = [
        { label: "Workouts completed", value: 0, target: 5 },
        { label: "Exercises discovered", value: 0, target: 10 },
        { label: "Longest streak", value: 0, target: 7 },
    ];
    const level = { label: "Novice", currentXp: 0, nextLevelXp: 1200 };

    return(
        <div>
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">To your goal:</h2>
                {selectedGoals.map(g => (
                    <GoalRow label=g.labal value=g.value target=g.target />
                ))}
            </section>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Add a new goal"/>
                </SelectTrigger>
                <SelectContent>
                    {possibleGoals.map(g => (
                            <SelectItem value=g.value>{g.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}