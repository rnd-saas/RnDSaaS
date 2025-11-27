import {GoalRow} from "@/pages/DashboardPage.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export default function Goals(){
    const [currentAddSelection, setAddSelection]  = useState("")
    const [currentRemoveSelection, setRemoveSelection]  = useState("")
    const [selectedGoals, setSelected] = useState([//todo: should fetch from db
        { label: "Workouts completed", value: 3, target: 5 },
        { label: "Exercises discovered", value: 7, target: 10 },
        { label: "Longest streak", value: 2, target: 7 },
    ]);

    const possibleGoals = [
        { label: "Workouts completed", value: "workoutsCompleted", target: 5 },
        { label: "Exercises discovered", value: "exercisesDiscovered", target: 10 },
        { label: "Longest streak", value: "longestStreak", target: 7 },
        { label: "Moods logged", value: "moodsLogged", target: 7 },
        { label: "Liked friends' posts", value: "likedFriendsPosts", target: 10 },
    ];

    const notSelectedGoals = possibleGoals.filter(
        goal1=> !selectedGoals.some(goal2=>goal2.label === goal1.label)
    );

    const level = { label: "Novice", currentXp: 0, nextLevelXp: 1200 };

    const handleAddGoal = (value) => {
        const selectedGoal = notSelectedGoals.find(g => g.value === value);
        if (!selectedGoal) return;

        const newGoal = {
            label: selectedGoal.label,
            value: 0,
            target: selectedGoal.target
        };
        setSelected((prev) => [...prev, newGoal]);
        setAddSelection("");
    };

    const handleRemoveGoal = (value) => {
        setSelected(prev =>
            prev.filter(goal => goal.label !== selectedGoals.find(g => g.value === value)?.label)
        );
        setAddSelection("");
    };

    return(
        <div>
            <section className="space-y-3 mb-4">
                {selectedGoals.map(g => (
                    <GoalRow label={g.label} value={g.value} target={g.target}/>
                ))}
            </section>
            <div className={"flex justify-between"}>
                <Select value={currentAddSelection} onValueChange={handleAddGoal}>
                    <SelectTrigger>
                        <SelectValue placeholder="Add a new goal"/>
                    </SelectTrigger>
                    <SelectContent>
                        {notSelectedGoals.map(g => (
                                <SelectItem value={g.value}>{g.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={currentRemoveSelection} onValueChange={handleRemoveGoal}>
                    <SelectTrigger>
                        <SelectValue placeholder="Remove a goal"/>
                    </SelectTrigger>
                    <SelectContent>
                        {selectedGoals.map(g => (
                            <SelectItem value={g.value}>{g.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}