import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings";
import tomAvatar from '../../assets/avatars/tom_avatar.png';
import {useLocation} from "react-router-dom";
import ChatbotButton from "@/components/chatbotButton";
import AccountSettings from "@/pages/Settings/SettingGroups/AccountSettings";

export default function SettingsPage() {
    const settingsComponents = [
        { value:"user", component: UserSettings, label: "User Settings" },
        { value:"subscription", component: SubscriptionSettings, label:"Subscription settings" },
        { value:"account", component: AccountSettings, label:"Account settings" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-[70vw] max-w-[70vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] min-h-[75vh] flex flex-col items-center space-y-6">
    <Avatar className="w-32 h-32">
        <AvatarImage src={tomAvatar} />
                <AvatarFallback className="text-3xl">Tom Avatar</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-semibold tracking-tight">{userName}</h2>
            <Accordion type="single" collapsible className="min-h-[75vh] w-[75vw] md:w-[50vw] lg:w-[30vw]">
                {settingsComponents.map((g) => (
                    <AccordionItem value={g.value}>
                        <AccordionTrigger>{g.label}</AccordionTrigger>
                        <AccordionContent>
                            <g.component/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <ChatbotButton variant={"default"}/>
        </div>
    )
}
