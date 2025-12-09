import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import type {OnboardingPayload} from "@/lib/api";
import {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {goalOptions} from "@/utils/GoalOptionLabels";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {type GymComfortLevel, PrimaryGoal} from "@/utils/InputTypes";
import {dayOptions} from "@/utils/DayOptionLabels";
import {Checkbox} from "@/components/ui/checkbox";
import {lengthOptions} from "@/utils/SessionLengthOptionLabels";
import {areaOptions} from "@/utils/AreaOptionLabels";
import {splitOptions} from "@/utils/SplitOptionLabels";
import {emotionOptions} from "@/utils/EmotionOptionLabels";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import { profileService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Loader2 } from "lucide-react";

export default function WorkoutPreferences({currentValues}: {currentValues?: OnboardingPayload}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // State for form values
    const [name, setName] = useState("");
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [goal, setGoal] = useState<PrimaryGoal | undefined>(undefined);
    const [daysPerWeek, setDaysPerWeek] = useState(0);
    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [sessionLength, setSessionLength] = useState(0);
    const [areas, setAreas] = useState<string[]>([]);
    const [split, setSplit] = useState<string | undefined>(undefined);
    const [emotions, setEmotions] = useState<GymComfortLevel[]>([]);

    // Fetch data on mount
    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setIsLoading(true);
            const data = await profileService.getPreferences();
            updateLocalState(data);
        } catch (error) {
            console.error("Failed to load preferences:", error);
            // Fallback to currentValues if available and fetch failed
            if (currentValues) {
                updateLocalState(currentValues);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateLocalState = (data: OnboardingPayload) => {
        setName(data.preferredName || "");
        setWeight(data.weightKg || 0);
        setHeight(data.heightCm || 0);
        setGoal(data.primaryGoal?.[0] as PrimaryGoal);
        setDaysPerWeek(data.trainingDaysPerWeek || 0);
        setAvailableDays(data.availableDays || []);
        setSessionLength(data.sessionDuration || 0);
        setAreas(data.problemAreas || []);
        setSplit(data.preferredSplit?.[0]);
        setEmotions((data.gymComfortLevel as GymComfortLevel[]) || []);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const payload: OnboardingPayload = {
                preferredName: name,
                weightKg: weight,
                heightCm: height,
                primaryGoal: goal ? [goal] : [],
                trainingDaysPerWeek: daysPerWeek,
                availableDays: availableDays,
                sessionDuration: sessionLength,
                problemAreas: areas,
                preferredSplit: split ? [split] : [],
                gymComfortLevel: emotions,
            };
            
            await profileService.updatePreferences(payload);
            setIsEditing(false);
            await loadPreferences(); // Reload to confirm
        } catch (error) {
            console.error("Failed to save preferences:", error);
            alert("Failed to save preferences. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadPreferences(); // Reset to original values
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    // Helper to render static view
    const renderStaticValue = (label: string, value: React.ReactNode) => (
        <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value || "-"}</span>
        </div>
    );

    const getGoalLabel = (val?: string) => goalOptions.find(o => o.value === val)?.label || val;
    const getSessionLengthLabel = (val: number) => lengthOptions.find(o => o.value === String(val))?.label || `${val} min`;
    const getSplitLabel = (val?: string) => splitOptions.find(o => o.value === val)?.label || val;
    const getAvailableDaysLabel = (days: number[]) => {
        if (!days || days.length === 0) return "None";
        return days.map(d => dayOptions.find(o => Number(o.value) === d)?.label).join(", ");
    };
    const getAreasLabel = (areas: string[]) => {
        if (!areas || areas.length === 0) return "None";
        return areas.map(a => areaOptions.find(o => o.value === a)?.label).join(", ");
    };
    const getEmotionsLabel = (emotions: string[]) => {
        if (!emotions || emotions.length === 0) return "None";
        return emotions.map(e => emotionOptions.find(o => o.value === e)?.label).join(", ");
    };

    return (
        <div className="relative">
            <div className="flex justify-end mb-4">
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Preferences
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <div className="space-y-2">
                    {renderStaticValue("Preferred Name", name)}
                    <Separator />
                    {renderStaticValue("Weight", `${weight} kg`)}
                    {renderStaticValue("Height", `${height} cm`)}
                    <Separator />
                    {renderStaticValue("Primary Goal", getGoalLabel(goal))}
                    <Separator />
                    {renderStaticValue("Days per Week", daysPerWeek)}
                    <Separator />
                    {renderStaticValue("Available Days", getAvailableDaysLabel(availableDays))}
                    <Separator />
                    {renderStaticValue("Session Length", getSessionLengthLabel(sessionLength))}
                    <Separator />
                    {renderStaticValue("Vulnerable Areas", getAreasLabel(areas))}
                    <Separator />
                    {renderStaticValue("Split Preference", getSplitLabel(split))}
                    <Separator />
                    <div className="py-2">
                        <span className="text-muted-foreground block mb-1">Emotions regarding gym</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {emotions.map(e => (
                                <span key={e} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                                    {emotionOptions.find(o => o.value === e)?.label || e}
                                </span>
                            ))}
                            {emotions.length === 0 && <span>-</span>}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className={"my-3 space-y-3"}>
                        <Label htmlFor={"nickname"}>Preferred name</Label>
                        <Input id="nickname" type="text" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label htmlFor={"weight"}>Weight (kg)</Label>
                        <Input id="weight" type="number" className="max-w-[20vw] md:max-w-[10vw]" value={weight}
                               onChange={(e) => setWeight(Number(e.target.value))}/>
                        <Label htmlFor={"height"}>Height (cm)</Label>
                        <Input id="height" type="number" className="max-w-[20vw] md:max-w-[10vw]" value={height}
                               onChange={(e) => setHeight(Number(e.target.value))}/>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Primary goal</Label>
                        <Select value={goal} onValueChange={(e) => setGoal(e as PrimaryGoal)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your primary goal"/>
                            </SelectTrigger>
                            <SelectContent>
                                {goalOptions.map((g) => (
                                    <SelectItem key={g.value} value={g.value} id={g.value}>{g.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Days per week</Label>
                        <Select value={String(daysPerWeek)} onValueChange={(e) => setDaysPerWeek(Number(e))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the number of days"/>
                            </SelectTrigger>
                            <SelectContent>
                                {[1,2,3,4,5,6,7].map((g) => (
                                    <SelectItem key={g} value={String(g)} id={String(g)}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Available days</Label>
                        <div className="flex flex-col gap-6">
                            {dayOptions.map(day => {
                                const dayValueNum = Number(day.value);
                                return (
                                    <div key={day.id} className="flex items-center gap-3">
                                        <Checkbox id={day.id} checked={availableDays.includes(dayValueNum)}
                                            onCheckedChange={checked => {
                                                setAvailableDays(prev =>
                                                checked
                                                    ? [...prev, dayValueNum]
                                                    : prev.filter(v => v !== dayValueNum)
                                            );
                                            }}
                                        />
                                        <Label htmlFor={day.id}>{day.label}</Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Session length</Label>
                        <Select value={String(sessionLength)} onValueChange={(e) => setSessionLength(Number(e))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the session duration"/>
                            </SelectTrigger>
                            <SelectContent>
                                {lengthOptions.map((g) => (
                                    <SelectItem key={g.id} value={g.value} id={g.id}>{g.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Vulnerable areas</Label>
                        <div className="flex flex-col gap-6">
                            {areaOptions.map(a => {
                                return (
                                    <div key={a.value} className="flex items-center gap-3">
                                        <Checkbox id={a.value} checked={areas.includes(a.value)}
                                                  onCheckedChange={checked => {
                                                      setAreas(prev =>
                                                          checked
                                                              ? [...prev, a.value]
                                                              : prev.filter(v => v !== a.value)
                                                      );
                                                  }}
                                        />
                                        <Label htmlFor={a.value}>{a.label}</Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Split preference</Label>
                        <Select value={split} onValueChange={(e) => setSplit(e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the preferred split"/>
                            </SelectTrigger>
                            <SelectContent>
                                {splitOptions.map((g) => (
                                    <SelectItem key={g.value} value={g.value} id={g.value}>{g.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator/>
                    <div className={"my-3 space-y-3"}>
                        <Label>Emotions regarding gym</Label>
                        <ToggleGroup type="multiple" variant="outline" size="sm" className="w-[75vw] flex-wrap justify-start"
                            value={emotions ?? []}
                            onValueChange={(value) => {setEmotions(value as GymComfortLevel[])}}
                        >
                            <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
                                {emotionOptions.map((emotion) => (
                                    <ToggleGroupItem
                                        key={emotion.value}
                                        value={emotion.value}
                                        className="data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-[var(--color-background)]"
                                    >
                                        {emotion.label}
                                    </ToggleGroupItem>
                                ))}
                            </div>
                        </ToggleGroup>
                    </div>
                </div>
            )}
        </div>
    )
}