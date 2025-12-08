import {Button} from "@/components/ui/button";
import {AlertTriangle, ArrowLeft, Loader2, MoreVertical, Send, CheckCircle2, Sparkles} from "lucide-react";
import tomAvatar from "../../assets/avatars/tom_avatar.png";
import sarahAvatar from "../../assets/avatars/sarah_avatar.png";
import {Input} from "@/components/ui/input";
import {useNavigate} from "react-router-dom";
import AvatarIcon from "@/components/avatarIcon";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {chatbotService, workoutService} from "@/lib/api";
import type {ChatbotMessage, ChatbotTrainerProfile} from "@/lib/api/types";
import { toast } from "sonner";

type ConversationMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    status: "pending" | "sent" | "error";
    fallback?: boolean;
    proposedPlan?: any; // Store parsed plan JSON
};

const AVATAR_MAP = {
    tom: tomAvatar,
    sarah: sarahAvatar
} as const;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ProposedPlanPreview = ({ planData }: { planData: any }) => {
    const plans = Array.isArray(planData) ? planData : (planData.proposed_plan || planData.plans);
    const programName = planData.program_name || "New Workout Plan";

    if (!plans || !Array.isArray(plans)) return null;

    // Sort plans by day number
    const sortedPlans = [...plans].sort((a, b) => a.day_number - b.day_number);

    return (
        <div className="w-full flex flex-col gap-3 bg-white/60 p-4 rounded-xl border border-green-200/60 text-sm shadow-sm">
            <div className="font-bold text-green-900 border-b border-green-200 pb-2">
                {programName}
            </div>
            
            <div className="flex flex-col gap-3">
                {sortedPlans.map((dayPlan: any) => (
                    <div key={dayPlan.day_number} className="flex flex-col gap-1">
                        <div className="font-semibold text-green-800">
                            {DAY_NAMES[dayPlan.day_number] || `Day ${dayPlan.day_number}`}
                        </div>
                        <div className="pl-3 flex flex-col gap-1">
                            {dayPlan.plan_exercises?.map((ex: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-[1fr_auto] gap-2 text-green-700">
                                    <span>• {ex.exercise_name || ex.name}</span>
                                    <span className="text-green-600/80 text-xs whitespace-nowrap">
                                        {ex.target_sets} sets × {ex.target_value}{ex.metric === 'duration_s' ? 's' : (ex.metric === 'weight' ? 'kg' : '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const createMessageId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function WorkoutPlanChatbotPage() {
    const [profile, setProfile] = useState<ChatbotTrainerProfile | null>(null);
    const [activePlan, setActivePlan] = useState<any | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const greetingInitializedRef = useRef(false);

    const preferredLanguage = useMemo(() => {
        if (typeof navigator === "undefined") return "en";
        return navigator.language || "en";
    }, []);

    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isMentalHealthLock, setIsMentalHealthLock] = useState(false);

    const hasProposedPlan = useMemo(() => messages.some(m => m.proposedPlan), [messages]);

    const trainerName = profile?.name ?? "Tom";
    const trainerAvatar = AVATAR_MAP[profile?.avatarKey ?? "tom"] ?? tomAvatar;
    const trainerId = profile?.trainerId ?? 0;

    const initGreeting = useCallback((name: string, plan: any) => {
        if (greetingInitializedRef.current) return;
        greetingInitializedRef.current = true;

        let greeting = `Hey, I'm ${name}. I can help you modify your workout plan.`;
        if (plan) {
            greeting += ` You are currently on the "${plan.name}" program (${plan.weeks_count} weeks). What would you like to change?`;
        } else {
            greeting += ` It looks like you don't have an active plan yet. Shall we create one?`;
        }

        setMessages([
            {
                id: createMessageId(),
                role: "assistant",
                status: "sent",
                content: greeting
            }
        ]);
    }, []);

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            try {
                setProfileError(null);
                const [profileData, planData] = await Promise.all([
                    chatbotService.fetchProfile(),
                    workoutService.getActiveWorkoutProgram()
                ]);
                
                if (!active) return;
                setProfile(profileData);
                setActivePlan(planData);
                initGreeting(profileData.name, planData);
            } catch (error: any) {
                if (!active) return;
                console.error("Failed to load chatbot data", error);
                // Try to load profile at least if plan fails, or vice versa
                // For simplicity, just show error if profile fails as it's critical for UI
                if (!profile) {
                     setProfileError(error?.message ?? "Failed to load your coach profile.");
                     initGreeting("your coach", null);
                }
            } finally {
                if (active) {
                    setIsProfileLoading(false);
                }
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, [initGreeting]);

    const buildPayloadMessages = useCallback((history: ConversationMessage[]): ChatbotMessage[] => {
        return history
            .filter((msg) => msg.status !== "error")
            .map((msg) => ({ role: msg.role, content: msg.content }))
            .slice(-10);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputClick = () => {
        if (isMentalHealthLock) {
            toast.error("Detected poor mental state. Please refer to a doctor or family friend.", {
                duration: 5000,
            });
        }
    };

    const extractProposedPlan = (content: string): any | null => {
        try {
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*"proposed_plan"[\s\S]*\}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                const parsed = JSON.parse(jsonStr);
                if (parsed.proposed_plan) {
                    // Return the full object so we can access program_name/description
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Failed to parse JSON from message", e);
        }
        return null;
    };

    const cleanMessageContent = (content: string): string => {
        // Remove the JSON block from the message content for display
        return content.replace(/```json\n[\s\S]*?\n```/g, "").replace(/\{[\s\S]*"proposed_plan"[\s\S]*\}/g, "").trim();
    };

    const handleSendMessage = async () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isSending) {
            return;
        }
        if (!profile && !profileError && isProfileLoading) {
            setErrorMessage("Still loading your coach profile. Please try again in a moment.");
            return;
        }

        const userMessage: ConversationMessage = {
            id: createMessageId(),
            role: "user",
            content: trimmedValue,
            status: "sent"
        };

        const typingMessage: ConversationMessage = {
            id: createMessageId(),
            role: "assistant",
            content: "Typing...",
            status: "pending"
        };

        const updatedHistory = [...messages, userMessage];
        setMessages([...updatedHistory, typingMessage]);
        setInputValue("");
        setErrorMessage(null);
        setIsSending(true);

        try {
            const response = await chatbotService.sendMessage({
                trainerId,
                messages: buildPayloadMessages(updatedHistory),
                metadata: {
                    language: preferredLanguage,
                    workoutPlanContext: activePlan // Inject current plan
                }
            });

            console.log("Raw Chatbot Response:", response.message.content);

            if (response.isMentalHealthIntervention) {
                setIsMentalHealthLock(true);
            }

            const proposedPlan = extractProposedPlan(response.message.content);
            const displayContent = proposedPlan ? cleanMessageContent(response.message.content) : response.message.content;

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === typingMessage.id
                        ? {
                              ...message,
                              content: displayContent || "I've prepared a new plan for you:", // Fallback text if message becomes empty
                              status: "sent",
                              fallback: response.fallback,
                              proposedPlan: proposedPlan
                          }
                        : message
                )
            );
        } catch (error: any) {
            console.error("Failed to send chatbot message", error);
            const message = error?.message || "Unable to reach the coach right now.";
            setErrorMessage(message);
            setMessages((prev) =>
                prev.map((current) =>
                    current.id === typingMessage.id
                        ? {
                              ...current,
                              status: "error",
                              content: message
                          }
                        : current
                )
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleConfirmPlan = async (planData: any) => {
        if (isUpdatingPlan) return;
        setIsUpdatingPlan(true);
        try {
            await workoutService.updateActiveWorkoutProgram(planData);
            toast.success("Workout plan updated successfully!");
            // Optionally refresh the page or update local state
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Failed to update plan", error);
            toast.error("Failed to update plan. Please try again.");
        } finally {
            setIsUpdatingPlan(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            await chatbotService.generatePlan(messages);
            toast.success("Workout plan generated successfully based on your chat!");
            // Optionally refresh to show new plan
             setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Failed to generate plan", error);
            toast.error("Failed to generate plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    //back button
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    //auto-scroll logic
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);

        return () => clearTimeout(timeout);
    }, [messages]);

    //hides customer support unless reported
    useEffect(() => {
        if ((window as any).tidioChatApi) {
            (window as any).tidioChatApi.hide();
        }
    }, []);
    const handleReport = (payload = {}) => {
        const api = (window as any).tidioChatApi;
        if (api) {
            // API is ready, emit the event
            api.display(true);
            api.open();
            api.messageFromOperator('What would you like to report?');
            api.track("reported");
            console.log("tried to report")
        } else {
            // Retry shortly after if API is not ready
            console.log("timeout")
            setTimeout(() => handleReport(payload), 100);
        }
    };

    return (
        <div className="w-full min-w-[50vw] min-h-[90vh] relative flex flex-col">
            <header className="px-6 sticky top-0 pt-11 pb-4 bg-white z-10">
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={handleGoBack}>
                        <ArrowLeft className="h-6 w-6"/>
                    </Button>
                    <div className="flex items-center gap-3">
                        <AvatarIcon icon={trainerAvatar}/>
                        <div className="flex flex-col gap-0.5">
                            <h2>{trainerName}</h2>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded bg-[var(--color-primary)]"/>
                                <p> Workout Planner</p>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-11 w-11 rounded-full">
                                <MoreVertical className="h-6 w-6"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={handleReport}>
                                Report chat
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 px-6 pt-4 h-full pb-[6rem] overflow-y-auto">
                {profileError && (
                    <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{profileError}</span>
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 rounded-2xl border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{errorMessage}</span>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {messages.map((message) => {
                        if (message.role === "assistant") {
                            return (
                                <div key={message.id} className="flex flex-col gap-2">
                                    <div className="flex items-start gap-2">
                                        <AvatarIcon icon={trainerAvatar}/>
                                        <div className="flex flex-col gap-2 p-4 rounded-[0px_24px_24px_24px] max-w-[calc(100%-56px)] text-[var(--intuitive-names-grey-text)] bg-[var(--intuitive-names-grey-background)]">
                                            <p className="whitespace-pre-wrap">{message.status === "pending" ? (
                                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    {message.content}
                                                </span>
                                            ) : message.content}</p>
                                            {message.fallback && message.status === "sent" && (
                                                <div className="text-xs text-amber-600 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                </div>
                                            )}
                                            {message.status === "error" && (
                                                <div className="text-xs text-red-500 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {message.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {message.proposedPlan && (
                                        <div className="ml-12 p-4 border rounded-xl bg-green-50 border-green-200">
                                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" />
                                                New Plan Proposed
                                            </h4>
                                            <p className="text-sm text-green-700 mb-4">
                                                The coach has suggested a new workout plan based on your request.
                                            </p>
                                            
                                            <div className="mb-4">
                                                <ProposedPlanPreview planData={message.proposedPlan} />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button 
                                                    onClick={() => handleConfirmPlan(message.proposedPlan)}
                                                    disabled={isUpdatingPlan}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {isUpdatingPlan ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Applying Changes...
                                                        </>
                                                    ) : (
                                                        "Confirm & Apply Changes"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={message.id} className="flex justify-end">
                                <div className="inline-flex items-start gap-1 px-4 py-2.5 rounded-3xl max-w-[calc(100%-48px)] text-[var(--intuitive-names-app-background)] bg-[var(--intuitive-names-app-primary)]">
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="px-6 mb-0 rounded-tl-[48px] bg-white sticky bottom-0 w-[90vw] lg:w-[60vw] inset-x-0 mx-auto flex flex-col gap-2 pt-4">
                {!hasProposedPlan && (
                    <div className="flex justify-center">
                        <Button variant="secondary" size="sm" onClick={handleGeneratePlan} disabled={isGenerating || messages.length < 2 || isMentalHealthLock} className="rounded-full px-6 shadow-sm hover:shadow-md transition-all bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate Plan from Chat
                        </Button>
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div onClick={handleInputClick} className="flex-1 flex items-center justify-between px-5 py-2.5 rounded-[48px] border-[1.5px] border-solid">
                        <Input placeholder={isProfileLoading ? "Loading coach..." : "Tell me what you'd like to adjust, then click the button above to make your program. "} onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyDown} disabled={isSending || isProfileLoading || isMentalHealthLock}
                            className="border-0 p-0 h-auto font-normal text-base leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Button size="icon" className="h-11 w-11 rounded-full" onClick={handleSendMessage} disabled={isSending || !inputValue.trim() || isProfileLoading || isMentalHealthLock}>
                        {isSending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" />}
                    </Button>
                </div>
                <p className="text-muted/50 mt-2 mb-0 p-0 leading-none">
                    Disclaimer: AI-generated content. Not a substitute for professional medical or mental health advice.
                    <a className={"ml-1 text-primary underline-offset-2 hover:underline hover:text-primary-hover active:text-primary-pressed"} href={`tel:1813`}>Dial support</a>
                </p>
            </footer>
        </div>
    )
}

