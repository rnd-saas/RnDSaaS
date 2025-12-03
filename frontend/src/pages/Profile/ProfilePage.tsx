import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import ChatbotButton from "@/components/chatbotButton.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import WorkoutDisplay from "@/pages/Profile/ProfileComponents/WorkoutDisplay.tsx";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import { Button } from "@/components/ui/button.tsx";
import SettingsButton from "@/components/settingsButton.tsx";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const navigate = useNavigate();
  const profileComponents = [
    {
      value: "achievements",
      component: AchievementList,
      destination: "/achievements",
      buttonText: "See More",
      label: "Recent Achievements",
    },
    {
      value: "recent-workouts",
      component: WorkoutDisplay,
      destination: "/calendar",
      buttonText: "See Full List",
      label: "Recent Workouts",
    },
  ];
  const { state } = useLocation() as { state?: { firstName?: string } };
  const userName =
    state?.firstName ?? localStorage.getItem("firstName") ?? "User";

  return (
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 flex flex-col space-y-8 bg-background text-foreground font-sans">
      <header className="flex flex-col items-center space-y-4 relative py-4">
        <Avatar className="w-32 h-32 shadow-xl ring-4 ring-background">
          <AvatarImage src={avatarPlaceholder} className="object-cover" />
          <AvatarFallback className="text-3xl font-serif">CN</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">
          {userName}
        </h2>
        <div className="absolute top-0 right-0">
          <SettingsButton />
        </div>
      </header>

      <main className="w-full space-y-12">
        {profileComponents.map((g, index) => (
          <div
            key={g.value}
            className="animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards space-y-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold font-serif text-foreground/90 shrink-0">
                {g.label}
              </h3>
              <Separator className="flex-1 bg-border" />
            </div>

            <div className="px-1">
              <g.component />
            </div>

            <div className="flex justify-center md:justify-start">
              <Button
                variant="outline"
                className="w-full md:w-auto min-w-[200px] h-10 font-medium"
                onClick={() => navigate(g.destination)}
              >
                {g.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-14 right-6 z-50">
        <div className="shadow-lg rounded-full">
          <ChatbotButton variant={"default"} />
        </div>
      </div>
    </div>
  );
}
