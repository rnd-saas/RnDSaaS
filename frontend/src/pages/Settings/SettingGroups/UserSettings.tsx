import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {settingsService, type UserSettings as ApiUserSettings, type UpdateSettingsRequest} from "@/lib/api";
import {ApiError} from "@/lib/api";

export default function UserSettings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<ApiUserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to load settings');
            }
            console.error('Failed to load settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = async (updates: UpdateSettingsRequest) => {
        if (!settings) return;

        setIsSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            const updated = await settingsService.updateSettings(updates);
            setSettings(updated);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to save settings');
            }
            console.error('Failed to save settings:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Map database units to UI units
    // Database stores 'metric' or 'imperial', UI needs specific weight/height units
    const getWeightUnit = () => {
        if (!settings) return 'kg';
        // If metric, default to kg; if imperial, default to lbs
        // Note: This is a simplified mapping. In a real app, you might want separate weight/height unit fields
        return settings.units === 'metric' ? 'kg' : 'lbs';
    };

    const getHeightUnit = () => {
        if (!settings) return 'cm';
        return settings.units === 'metric' ? 'cm' : 'ft';
    };

    const handleWeightUnitChange = (value: string) => {
        // Map UI units to database units
        // kg and st are metric, lbs is imperial
        const units = (value === 'kg' || value === 'st') ? 'metric' : 'imperial';
        updateSetting({ units });
    };

    const handleHeightUnitChange = (value: string) => {
        // cm is metric, ft is imperial
        const units = value === 'cm' ? 'metric' : 'imperial';
        updateSetting({ units });
    };
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
        { id: "monday", label: "Monday", value: 0 },
        { id: "tuesday", label: "Tuesday", value: 1 },
        { id: "wednesday", label: "Wednesday", value: 2 },
        { id: "thursday", label: "Thursday", value: 3 },
        { id: "friday", label: "Friday", value: 4 },
        { id: "saturday", label: "Saturday", value: 5 },
        { id: "sunday", label: "Sunday", value: 6 },
    ];
    const trainerOptions = [
        { id: "tom", label: "Tom", value: 0 },
        { id: "sarah", label: "Sarah", value: 1 },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6 w-full max-w-xl">
                <p className="text-sm text-muted-foreground">Loading settings...</p>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="space-y-6 w-full max-w-xl">
                <p className="text-sm text-red-500">Failed to load settings</p>
                <button onClick={loadSettings} className="text-sm text-blue-500 underline">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-xl">
            {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                </div>
            )}
            {saveSuccess && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
                    Settings saved successfully!
                </div>
            )}
            
            {/* Weight Unit */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="weight-unit" className="mr-4 whitespace-nowrap">Weight unit</Label>
                <Select 
                    value={getWeightUnit()} 
                    onValueChange={handleWeightUnitChange}
                    disabled={isSaving}
                >
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
                <Select 
                    value={getHeightUnit()} 
                    onValueChange={handleHeightUnitChange}
                    disabled={isSaving}
                >
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
                <Switch 
                    id="notifications" 
                    checked={settings.notifications_enabled}
                    onCheckedChange={(checked) => updateSetting({ notifications_enabled: checked })}
                    disabled={isSaving}
                />
            </div>
            
            {/* Streak Display */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="streak-display" className="mr-4 whitespace-nowrap">Show streak on dashboard</Label>
                <Switch 
                    id="streak-display" 
                    checked={settings.streak_display}
                    onCheckedChange={(checked) => updateSetting({ streak_display: checked })}
                    disabled={isSaving}
                />
            </div>
            
            {/* Goal Display */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="goal-display" className="mr-4 whitespace-nowrap">Show goal on dashboard</Label>
                <Select 
                    value={settings.goal_display} 
                    onValueChange={(value: 'big' | 'small' | 'both' | 'none') => updateSetting({ goal_display: value })}
                    disabled={isSaving}
                >
                    <SelectTrigger id="goal-display" className="w-60">
                        <SelectValue placeholder="Select goal display" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="big">Big</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Separator />
            
            {/* Weekly Review Day */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="weekly-review-day" className="mr-4 whitespace-nowrap">Weekly review day</Label>
                <Select 
                    value={settings.weekly_review_day.toString()} 
                    onValueChange={(value) => updateSetting({ weekly_review_day: parseInt(value) })}
                    disabled={isSaving}
                >
                    <SelectTrigger id="weekly-review-day" className="w-60">
                        <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayOptions.map((day) => (
                            <SelectItem key={day.id} value={day.value.toString()}>
                                {day.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {/* Trainer */}
            <div className="flex items-center justify-between w-full">
                <Label htmlFor="trainer" className="mr-4 whitespace-nowrap">Chosen trainer</Label>
                <Select 
                    value={settings.trainer.toString()} 
                    onValueChange={(value) => updateSetting({ trainer: parseInt(value) })}
                    disabled={isSaving}
                >
                    <SelectTrigger id="trainer" className="w-60">
                        <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainerOptions.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.value.toString()}>
                                {trainer.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isSaving && (
                <p className="text-sm text-muted-foreground">Saving...</p>
            )}
            <Separator/>
            <Button variant={"outline"} onClick={() => navigate("/onboarding")}>Redo Onboarding</Button>
        </div>
    );
}
