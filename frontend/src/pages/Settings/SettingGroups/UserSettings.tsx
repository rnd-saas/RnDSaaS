import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Switch} from "@/components/ui/switch.tsx";

export type UserSettings = {
    weightUnits:string,
    heightUnit:string,
    notificationsEnabled:boolean,
    streakDisplay:boolean,
    goalDisplay:boolean,
    weeklyReviewDay:number,
    trainer:number
}

export default function UserSettings() {
    const weightUnitOptions = [
        { value: "kg", label: "Kg" },
        { value: "lbs", label: "Lbs" },
        { value: "st", label: "St" },
    ];
    const heightUnitOptions = [
        { value: "cm", label: "Cm" },
        { value: "ft", label: "Ft" },
    ];
    const dayOptions = [
        { id: "monday", label: "Monday", value: "0" },
        { id: "tuesday", label: "Tuesday", value: "1" },
        { id: "wednesday", label: "Wednesday", value: "2" },
        { id: "thursday", label: "Thursday", value: "3" },
        { id: "friday", label: "Friday", value: "4" },
        { id: "saturday", label: "Saturday", value: "5" },
        { id: "sunday", label: "Sunday", value: "6" },
    ];
    const trainerOptions = [
        { id: "tom", label: "Tom", value: "0" },
        { id: "sarah", label: "Sarah", value: "1" },
    ];
    return (
        <div className="space-y-6 w-full max-w-xl">
            {/* Weight Unit */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="weight-unit" className="mr-4 whitespace-nowrap">Weight unit</Label>
                <Select>
                    <SelectTrigger id="weight-unit" className="w-60">
                        <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {weightUnitOptions.map((wu) => (
                            <SelectItem key={wu.value} value={wu.value}>
                                {wu.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Height Unit */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="height-unit" className="mr-4 whitespace-nowrap">Height unit</Label>
                <Select>
                    <SelectTrigger id="height-unit" className="w-60">
                        <SelectValue placeholder="Select height unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {heightUnitOptions.map((hu) => (
                            <SelectItem key={hu.value} value={hu.value}>
                                {hu.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator />
            {/* Notifications */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="notifications" className="mr-4 whitespace-nowrap">Notifications enabled</Label>
                <Switch id="notifications" />
            </div>
            {/* Streak Display */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="streak-display" className="mr-4 whitespace-nowrap">Show streak on dashboard</Label>
                <Switch id="streak-display" />
            </div>
            {/* Goal Display */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="goal-display" className="mr-4 whitespace-nowrap">Show goal on dashboard</Label>
                <Switch id="goal-display" />
            </div>
            <Separator />
            {/* Weekly Review Day */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="weekly-review-day" className="mr-4 whitespace-nowrap">Weekly review day</Label>
                <Select>
                    <SelectTrigger id="weekly-review-day" className="w-60">
                        <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayOptions.map((day) => (
                            <SelectItem key={day.id} value={day.value}>
                                {day.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Trainer */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="trainer" className="mr-4 whitespace-nowrap">Chosen trainer</Label>
                <Select>
                    <SelectTrigger id="trainer" className="w-60">
                        <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainerOptions.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.value}>
                                {trainer.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}