import {useState, useEffect} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {progressService} from "@/lib/api";
import {Pencil, Check, X} from "lucide-react";

export default function Goals(){
    const [currentAddSelection, setAddSelection]  = useState("")
    const [currentRemoveSelection, setRemoveSelection]  = useState("")
    const [selectedGoals, setSelected] = useState<Array<{ label: string; value: number; target: number; id?: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
    const [editTarget, setEditTarget] = useState<string>("");
    const [completedGoal, setCompletedGoal] = useState<{ label: string; value: number; target: number; id?: number } | null>(null);
    const [showCompletedDialog, setShowCompletedDialog] = useState(false);

    const possibleGoals = [
        { label: "Workouts completed", value: "workoutsCompleted", target: 5 },
        { label: "Exercises completed", value: "exercisesCompleted", target: 10 },
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
            
            // Check for completed or exceeded goals (value >= target)
            const completedOrExceeded = goals.find(g => g.value >= g.target);
            
            if (completedOrExceeded) {
                const storageKey = `completed_goal_${completedOrExceeded.id}`;
                try {
                    const hasShown = localStorage.getItem(storageKey);
                    if (!hasShown) {
                        setCompletedGoal(completedOrExceeded);
                        setShowCompletedDialog(true);
                        // Mark as shown (will be cleared when target is updated)
                        localStorage.setItem(storageKey, 'true');
                    }
                } catch (e) {
                    // If localStorage fails, still show the dialog
                    setCompletedGoal(completedOrExceeded);
                    setShowCompletedDialog(true);
                }
            }
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

    const handleStartEdit = (goalId: number, currentTarget: number) => {
        setEditingGoalId(goalId);
        setEditTarget(currentTarget.toString());
    };

    const handleCancelEdit = () => {
        setEditingGoalId(null);
        setEditTarget("");
    };

    const handleSaveEdit = async (goalId: number) => {
        const targetValue = Number(editTarget);
        if (isNaN(targetValue) || targetValue <= 0) {
            alert('Please enter a valid target value greater than 0');
            return;
        }

        try {
            await progressService.updateGoal(goalId, { target: targetValue });
            // Clear completed goal flag when target is updated
            const completedKey = `completed_goal_${goalId}`;
            try {
                localStorage.removeItem(completedKey);
            } catch (e) {
                // Ignore localStorage errors
            }
            await loadGoals();
            setEditingGoalId(null);
            setEditTarget("");
            setShowCompletedDialog(false);
            setCompletedGoal(null);
        } catch (error) {
            console.error('Failed to update goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-4">Loading goals...</div>;
    }

    return(
        <div>
            {/* Congratulations dialog for completed/exceeded goals */}
            <Dialog open={showCompletedDialog} onOpenChange={setShowCompletedDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Congratulations! 🎉</DialogTitle>
                        <DialogDescription>
                            {completedGoal && (
                                <>
                                    {completedGoal.value > completedGoal.target ? (
                                        <>
                                            You've exceeded your goal for <strong>{completedGoal.label}</strong>! 
                                            You've completed <strong>{completedGoal.value}</strong> out of your target of <strong>{completedGoal.target}</strong>.
                                        </>
                                    ) : (
                                        <>
                                            You've completed your goal for <strong>{completedGoal.label}</strong>! 
                                            You've reached your target of <strong>{completedGoal.target}</strong>.
                                        </>
                                    )}
                                    <br /><br />
                                    Please set a new goal to continue tracking your progress.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => {
                            if (completedGoal?.id) {
                                handleStartEdit(completedGoal.id, completedGoal.target);
                            }
                            setShowCompletedDialog(false);
                        }}>
                            Set New Goal
                        </Button>
                        <Button variant="outline" onClick={() => setShowCompletedDialog(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <section className="space-y-3 mb-4">
                {selectedGoals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No goals yet. Add one below!</p>
                ) : (
                    selectedGoals.map((g, index) => (
                        <div key={g.id || index} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[15px]">
                                <span className="list-item ml-6 list-disc marker:text-foreground/80">{g.label}:</span>
                                <div className="flex items-center gap-2">
                                    {editingGoalId === g.id ? (
                                        <>
                                            <Input
                                                type="number"
                                                value={editTarget}
                                                onChange={(e) => setEditTarget(e.target.value)}
                                                className="w-20 h-7 text-sm"
                                                min="1"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveEdit(g.id!);
                                                    } else if (e.key === 'Escape') {
                                                        handleCancelEdit();
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0"
                                                onClick={() => handleSaveEdit(g.id!)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0"
                                                onClick={handleCancelEdit}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tabular-nums">{g.value} / {g.target}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0"
                                                onClick={() => handleStartEdit(g.id!, g.target)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Progress 
                                value={Math.max(0, Math.min(100, (g.value / g.target) * 100))} 
                                className="h-2 rounded-full mt-1.5" 
                            />
                        </div>
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