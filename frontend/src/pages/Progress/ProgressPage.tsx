import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import ChatbotButton from "@/components/chatbotButton.tsx";
import Goals from "@/pages/Progress/ProgressComponents/Goals.tsx";
import Moods from "@/pages/Progress/ProgressComponents/Moods.tsx";
import Workouts from "@/pages/Progress/ProgressComponents/Workouts.tsx";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import PersonalData from "@/pages/Progress/ProgressComponents/PersonalData.tsx";
import { Separator } from "@/components/ui/separator";
import {useEffect} from "react";

export default function ProgressPage() {
  const progressComponents = [
    {
      value: "achievements",
      component: AchievementList,
      label: "Recent Achievements",
    },
    { value: "goals", component: Goals, label: "Your Goals" },
    { value: "moods", component: Moods, label: "This Week's Mood" },
    { value: "workouts", component: Workouts, label: "Workout Frequency" },
    { value: "calendar", component: WorkoutDisplay, label: "Planned Workouts" },
    { value: "data", component: PersonalData, label: "Body Metrics" },
  ];

    useEffect(() => {
        window.tidioChatApi.show();
    }, []);
  return (
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 flex flex-col space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your journey and body metrics.
        </p>
      </header>

      <div className="space-y-12">
        {progressComponents.map((section, index) => (
          <div
            key={section.value}
            className="animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards space-y-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold font-serif text-foreground/90 shrink-0">
                {section.label}
              </h2>
              <Separator className="flex-1" />
            </div>

            <div className="px-1">
              <section.component />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-14 right-6 z-50">
        <div className="shadow-lg rounded-full">
          <ChatbotButton variant={"default"} />
        </div>
      </div>
    </div>
  );
}
