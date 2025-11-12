import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings.tsx";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings.tsx";
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import {useLocation} from "react-router-dom";

export default function SettingsPage() {
    const settingsComponents = [
        { value:"user", component: UserSettings, label: "User Settings" },
        { value:"subscription", component: SubscriptionSettings, label:"Subscription settings" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-[70vw] max-w-[70vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] min-h-[75vh] flex flex-col items-center space-y-6">
        <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPlaceholder} />
                <AvatarFallback className="text-3xl">Tom Avatar</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-semibold tracking-tight">{userName}!</h2>
            <Accordion type="single" collapsible className="w-full">
                {settingsComponents.map((g) => (
                    <AccordionItem value={g.value}>
                        <AccordionTrigger>{g.label}</AccordionTrigger>
                        <AccordionContent>
                            <g.component/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
