import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import type {OnboardingPayload} from "@/lib/api";
import {useState} from "react";
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

export default function WorkoutPreferences({currentValues}:{ currentValues: OnboardingPayload }){
    const [name, setName] = useState(currentValues?.preferredName);
    const [weight, setWeight] = useState(currentValues?.weightKg);
    const [height, setHeight] = useState(currentValues?.heightCm);
    const [goal, setGoal] = useState<PrimaryGoal>(currentValues?.primaryGoal[0] as PrimaryGoal);
    const [daysPerWeek, setDaysPerWeek] = useState(currentValues?.trainingDaysPerWeek);
    const [availableDays, setAvailableDays] = useState(currentValues?.availableDays);
    const [sessionLength, setSessionLength] = useState(currentValues?.sessionDuration);
    const [areas, setAreas] = useState(currentValues?.problemAreas ?? []);
    const [split, setSplit] = useState(currentValues?.preferredSplit[0]);
    const [emotions, setEmotions] = useState(currentValues?.gymComfortLevel);

    return(
        <div>
            <div className={"my-3 space-y-3"}>
                <Label htmlFor={"nickname"}>Preferred name</Label>
                <Input id="nickname" type="text" value={name}
                       onChange={(e) => setName(e.target.value)}/>
            </div>
            <Separator/>
            <div className={"my-3 space-y-3"}>
                <Label htmlFor={"weight"}>Weight</Label>
                <Input id="weight" type="number" className="max-w-[20vw] md:max-w-[10vw]" value={weight}
                       onChange={(e) => setWeight(Number(e.target.value))}/>
                <Label htmlFor={"height"}>Height</Label>
                <Input id="height" type="number" className="max-w-[20vw] md:max-w-[10vw]" value={height}
                       onChange={(e) => setHeight(Number(e.target.value))}/>
            </div>
            <Separator/>
            <div className={"my-3 space-y-3"}>
                <Label>Primary goal</Label>
                <Select defaultValue={goal} onValueChange={(e) => setGoal(e as PrimaryGoal)}>
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
                <Select defaultValue={String(daysPerWeek)} onValueChange={(e) => setDaysPerWeek(Number(e))}>
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
                <Select defaultValue={String(sessionLength)} onValueChange={(e) => setSessionLength(Number(e))}>
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
                <Select defaultValue={split} onValueChange={(e) => setSplit(e)}>
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
                <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm" className="w-[75vw] flex-wrap"
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
    )
}