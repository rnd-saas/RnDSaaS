import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings";
import tomAvatar from '../../assets/avatars/tom_avatar.png';
import { useLocation } from "react-router-dom";
import ChatbotButton from "@/components/chatbotButton";
import AccountSettings from "@/pages/Settings/SettingGroups/AccountSettings";

export default function SettingsPage() {
    const settingsComponents = [
        { value: "user", component: UserSettings, label: "User Settings" },
        { value: "subscription", component: SubscriptionSettings, label: "Subscription Settings" },
        { value: "account", component: AccountSettings, label: "Account Settings" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        // Changed from fixed vw widths to a responsive centered container
        <div className="w-full max-w-lg md:max-w-xl mx-auto p-6 pb-24 flex flex-col items-center space-y-8 min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 shadow-md ring-4 ring-background">
                    <AvatarImage src={tomAvatar} />
                    <AvatarFallback className="text-2xl">
                        {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold tracking-tight">{userName}</h2>
            </div>

            {/* Accordion takes full width of the container */}
            <Accordion type="single" collapsible className="w-full space-y-4">
                {settingsComponents.map((g) => (
                    <AccordionItem 
                        key={g.value} 
                        value={g.value} 
                        className="border rounded-xl px-4 bg-card shadow-sm"
                    >
                        <AccordionTrigger className="hover:no-underline py-4 font-medium text-base">
                            {g.label}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6 px-1">
                            <g.component />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Floating action button consistent with other pages */}
            <div className="fixed bottom-20 right-6 z-50">
                <div className="shadow-lg">
                    <ChatbotButton variant={"default"}/>
                </div>
            </div>
        </div>
    )
}
