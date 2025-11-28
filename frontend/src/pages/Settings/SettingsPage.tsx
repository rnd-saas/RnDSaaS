import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings.tsx";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings.tsx";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { useLocation } from "react-router-dom";
import { MessageSquareMore } from "lucide-react";
import AccountSettings from "@/pages/Settings/SettingGroups/AccountSettings.tsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const settingsComponents = [
    { value: "user", component: UserSettings, label: "User Settings" },
    {
      value: "subscription",
      component: SubscriptionSettings,
      label: "Subscription settings",
    },
    { value: "account", component: AccountSettings, label: "Account settings" },
  ];
  const { state } = useLocation() as { state?: { firstName?: string } };
  const userName =
    state?.firstName ?? localStorage.getItem("firstName") ?? "User";

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen flex flex-col font-sans">
      <div className="flex-1 p-6 space-y-8 pb-24">
        <header className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={avatarPlaceholder} />
            <AvatarFallback className="text-3xl font-serif">CN</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-semibold tracking-tight font-serif">
            {userName}
          </h2>
        </header>
        <Accordion type="single" collapsible className="w-full">
          {settingsComponents.map((g) => (
            <AccordionItem value={g.value} key={g.value}>
              <AccordionTrigger className="font-serif text-base">
                {g.label}
              </AccordionTrigger>
              <AccordionContent className="font-sans">
                <g.component />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="sticky bottom-13 z-20 w-full flex justify-end px-6 pointer-events-none">
        <Button
          size="icon"
          variant="default"
          className="h-12 w-12 pointer-events-auto"
          onClick={() => navigate("/chatbot")}
        >
          <MessageSquareMore size={24} />
        </Button>
      </div>
    </div>
  );
}
