import {GoalRow} from "@/pages/DashboardPage.tsx";
import {useState, useEffect} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {progressService} from "@/lib/api";

export default function Goals(){
    const [currentAddSelection, setAddSelection]  = useState("")
    const [currentRemoveSelection, setRemoveSelection]  = useState("")
    const [selectedGoals, setSelected] = useState<Array<{ label: string; value: number; target: number; id?: number }>>([]);
    const [loading, setLoading] = useState(true);

    const possibleGoals = [
        { label: "Workouts completed", value: "workoutsCompleted", target: 5 },
        { label: "Exercises discovered", value: "exercisesDiscovered", target: 10 },
        { label: "Longest streak", value: "longestStreak", target: 7 },
        { label: "Moods logged", value: "moodsLogged", target: 7 },
    ];

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            setLoading(true);
            const response = await progressService.getGoals();
            const goals = response.goals.map(g => ({
                label: g.label,
                value: g.value,
                target: g.target,
                id: g.id
            }));
            setSelected(goals);
        } catch (error) {
            console.error('Failed to load goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const notSelectedGoals = possibleGoals.filter(
        goal1=> !selectedGoals.some(goal2=>goal2.label === goal1.label)
    );

    const handleAddGoal = async (value: string) => {
        if (!value) return;
        
        const selectedGoal = notSelectedGoals.find(g => g.value === value);
        if (!selectedGoal) return;

        try {
            await progressService.createGoal({
                label: selectedGoal.label,
                goalType: selectedGoal.value,
                target: selectedGoal.target,
                initialValue: 0
            });
            await loadGoals();
            setAddSelection("");
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Failed to create goal. Please try again.');
        }
    };

    const handleRemoveGoal = async (label: string) => {
        if (!label) return;
        
        const goal = selectedGoals.find(g => g.label === label);
        if (!goal || !goal.id) return;

        try {
            await progressService.deleteGoal(goal.id);
            await loadGoals();
            setRemoveSelection("");
        } catch (error) {
            console.error('Failed to delete goal:', error);
            alert('Failed to delete goal. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-4">Loading goals...</div>;
    }

    return(
        <div>
            <section className="space-y-3 mb-4">
                {selectedGoals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No goals yet. Add one below!</p>
                ) : (
                    selectedGoals.map((g, index) => (
                        <GoalRow key={g.id || index} label={g.label} value={g.value} target={g.target}/>
                    ))
                )}
            </section>
            <div className={"flex justify-between gap-2"}>
                <Select value={currentAddSelection} onValueChange={handleAddGoal}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add a new goal"/>
                    </SelectTrigger>
                    <SelectContent>
                        {notSelectedGoals.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">All goals added</div>
                        ) : (
                            notSelectedGoals.map(g => (
                                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                <Select value={currentRemoveSelection} onValueChange={handleRemoveGoal}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Remove a goal"/>
                    </SelectTrigger>
                    <SelectContent>
                        {selectedGoals.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">No goals to remove</div>
                        ) : (
                            selectedGoals.map(g => (
                                <SelectItem key={g.id || g.label} value={g.label}>{g.label}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}