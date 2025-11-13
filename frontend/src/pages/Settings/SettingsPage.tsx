import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings.tsx";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings.tsx";
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import {useLocation} from "react-router-dom";
import ChatbotButton from "@/components/chatbotButton.tsx";
import AccountSettings from "@/pages/Settings/SettingGroups/AccountSettings.tsx";

export default function SettingsPage() {
    const settingsComponents = [
        { value:"user", component: UserSettings, label: "User Settings" },
        { value:"subscription", component: SubscriptionSettings, label:"Subscription settings" },
        { value:"account", component: AccountSettings, label:"Account settings" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-full max-w-md min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPlaceholder} />
                <AvatarFallback className="text-3xl">CN</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-semibold tracking-tight">{userName}!</h2>
            <Accordion type="single" collapsible className="w-full max-w-md min-h-[75vh] min-w-[30vw]">
                {settingsComponents.map((g) => (
                    <AccordionItem value={g.value}>
                        <AccordionTrigger>{g.label}</AccordionTrigger>
                        <AccordionContent>
                            <g.component/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <ChatbotButton variant={"primary"}/>
        </div>
    )
}
