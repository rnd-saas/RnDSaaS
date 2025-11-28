import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

export type UserSettings = {
  weightUnits: string;
  heightUnit: string;
  notificationsEnabled: boolean;
  streakDisplay: boolean;
  goalDisplay: boolean;
  weeklyReviewDay: number;
  trainer: number;
};

export default function UserSettings() {
  const navigate = useNavigate();
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
    <div className="space-y-6 w-full">
      {/* Weight Unit */}
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="weight-unit"
          className="whitespace-nowrap font-sans text-sm"
        >
          Weight unit
        </Label>
        <Select>
          <SelectTrigger id="weight-unit" className="w-[180px] ">
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
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="height-unit"
          className="whitespace-nowrap font-sans text-sm"
        >
          Height unit
        </Label>
        <Select>
          <SelectTrigger id="height-unit" className="w-[180px]">
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
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="notifications"
          className="whitespace-nowrap font-sans text-sm"
        >
          Notifications enabled
        </Label>
        <Switch id="notifications" />
      </div>
      {/* Streak Display */}
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="streak-display"
          className="whitespace-nowrap font-sans text-sm"
        >
          Show streak on dashboard
        </Label>
        <Switch id="streak-display" />
      </div>
      {/* Goal Display */}
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="goal-display"
          className="whitespace-nowrap font-sans text-sm"
        >
          Show goal on dashboard
        </Label>
        <Switch id="goal-display" />
      </div>
      <Separator />
      {/* Weekly Review Day */}
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="weekly-review-day"
          className="whitespace-nowrap font-sans text-sm"
        >
          Weekly review day
        </Label>
        <Select>
          <SelectTrigger id="weekly-review-day" className="w-[180px]">
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
      <div className="flex items-center justify-between w-full gap-4">
        <Label
          htmlFor="trainer"
          className="whitespace-nowrap font-sans text-sm"
        >
          Chosen trainer
        </Label>
        <Select>
          <SelectTrigger id="trainer" className="w-[180px]">
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
      <Separator />
      <Button
        variant={"link"}
        className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground font-serif"
        onClick={() => navigate("/onboarding")}
      >
        Redo Onboarding
      </Button>
    </div>
  );
}
