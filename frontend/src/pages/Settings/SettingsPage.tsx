import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserSettings from "@/pages/Settings/SettingGroups/UserSettings";
import SubscriptionSettings from "@/pages/Settings/SettingGroups/SubscriptionSettings";
import tomAvatar from '../../assets/avatars/tom_avatar.png';
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import ChatbotButton from "@/components/chatbotButton";
import AccountSettings from "@/pages/Settings/SettingGroups/AccountSettings";
import { ChevronLeft } from "lucide-react"; // Added ChevronLeft icon
import { Button } from "@/components/ui/button"; // Added Button component

export default function SettingsPage() {
    const navigate = useNavigate(); // Hook for navigation
    const settingsComponents = [
        { value: "user", component: UserSettings, label: "User Settings" },
        { value: "subscription", component: SubscriptionSettings, label: "Subscription Settings" },
        { value: "account", component: AccountSettings, label: "Account Settings" },
    ];
    const { state } = useLocation() as { state?: { firstName?: string } };
    const userName = state?.firstName ?? localStorage.getItem("firstName") ?? "User";

    return (
        <div className="w-full max-w-lg md:max-w-xl mx-auto p-6 pb-24 flex flex-col items-center space-y-8 min-h-screen relative">
            {/* Header with Back Button */}
            <div className="w-full flex items-center justify-start absolute top-6 left-6">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(-1)} // Go back to previous page (Profile)
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                </Button>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-8"> {/* Added margin-top to clear the back button */}
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
                        // Added 'last:mb-0' and ensured border is visible
                        // The issue might be the default AccordionItem styles in your UI library
                        // forcing a border-b: 0 on the last item.
                        // We override this by using !border-b or just relying on the full border.
                        className="border border-border rounded-xl px-4 bg-card shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all"
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
