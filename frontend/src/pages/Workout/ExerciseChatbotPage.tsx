import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Loader2, MoreVertical, Send } from "lucide-react";
import tomAvatar from "../../assets/avatars/tom_avatar.png";
import sarahAvatar from "../../assets/avatars/sarah_avatar.png";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import AvatarIcon from "@/components/avatarIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatbotService } from "@/lib/api";
import apiClient from "@/lib/api/client";
import type { ChatbotMessage, ChatbotTrainerProfile } from "@/lib/api/types";
import { toast } from "sonner";
import { useExercise } from "@/lib/api/workouts.tsx";

type ConversationMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    status: "pending" | "sent" | "error";
    fallback?: boolean;
};

const AVATAR_MAP = {
    tom: tomAvatar,
    sarah: sarahAvatar
} as const;

const createMessageId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function ExerciseChatbotPage() {
    const navigate = useNavigate();
    const { exerciseSlug } = useParams<{ exerciseSlug: string }>();
    const { data: exercise, isLoading: isExerciseLoading } = useExercise(exerciseSlug || "");

    const [profile, setProfile] = useState<ChatbotTrainerProfile | null>(null);
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
    const [isMentalHealthLock, setIsMentalHealthLock] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const status = apiClient.getSubscriptionStatus();
        setIsSubscribed(status === 'active' || status === 'trialing');
    }, []);

    const trainerName = profile?.name ?? "Tom";
    const trainerAvatar = AVATAR_MAP[profile?.avatarKey ?? "tom"] ?? tomAvatar;
    const trainerId = profile?.trainerId ?? 0;

    const initGreeting = useCallback((name: string, exerciseName: string) => {
        if (greetingInitializedRef.current) return;
        greetingInitializedRef.current = true;

        const greeting = `Hey, I'm ${name}. I can help you with any questions about ${exerciseName}. Ask me about proper form, common mistakes, alternatives, or anything else!`;

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
                const profileData = await chatbotService.fetchProfile();
                
                if (!active) return;
                setProfile(profileData);
                
                if (exercise) {
                    initGreeting(profileData.name, exercise.name);
                }
            } catch (error: any) {
                if (!active) return;
                console.error("Failed to load chatbot profile", error);
                setProfileError(error?.message ?? "Failed to load your coach profile.");
                if (exercise) {
                    initGreeting("your coach", exercise.name);
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
    }, [initGreeting, exercise]);

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

    const handleSendMessage = async () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isSending) {
            return;
        }
        if (!profile && !profileError && isProfileLoading) {
            setErrorMessage("Still loading your coach profile. Please try again in a moment.");
            return;
        }
        if (!exercise) {
            setErrorMessage("Exercise information not loaded yet. Please try again.");
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
            const response = await chatbotService.sendExerciseMessage({
                trainerId,
                messages: buildPayloadMessages(updatedHistory),
                metadata: {
                    language: preferredLanguage,
                    exerciseContext: {
                        name: exercise.name,
                        slug: exercise.slug,
                        description: exercise.description,
                        instructions: exercise.instructions,
                        muscleGroups: exercise.muscleGroups,
                        difficulty: String(exercise.difficultyLevel)
                    }
                }
            });

            if (response.isMentalHealthIntervention) {
                setIsMentalHealthLock(true);
            }

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === typingMessage.id
                        ? {
                              ...message,
                              content: response.message.content,
                              status: "sent",
                              fallback: response.fallback
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleGoBack = () => {
        // 返回 ExercisePage，标记为从 chatbot 来的
        navigate(-1);
    };

    // Auto-scroll logic
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);

        return () => clearTimeout(timeout);
    }, [messages]);

    // Hide customer support
    useEffect(() => {
        if ((window as any).tidioChatApi) {
            (window as any).tidioChatApi.hide();
        }
    }, []);

    const handleReport = (payload = {}) => {
        const api = (window as any).tidioChatApi;
        if (api) {
            api.display(true);
            api.open();
            api.messageFromOperator('What would you like to report?');
            api.track("reported");
            console.log("tried to report")
        } else {
            console.log("timeout")
            setTimeout(() => handleReport(payload), 100);
        }
    };

    if (isExerciseLoading || !exercise) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="w-full min-w-[50vw] min-h-[90vh] relative flex flex-col">
            {/* Header */}
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
                                <p className="text-sm">Exercise Help</p>
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

            {/* Messages */}
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
                    {messages.map((msg) => {
                        const isUser = msg.role === "user";
                        const isError = msg.status === "error";
                        const isPending = msg.status === "pending";

                        if (!isUser) {
                            return (
                                <div key={msg.id} className="flex flex-col gap-2">
                                    <div className="flex items-start gap-2">
                                        <AvatarIcon icon={trainerAvatar}/>
                                        <div className="flex flex-col gap-2 p-4 rounded-[0px_24px_24px_24px] max-w-[calc(100%-56px)] text-[var(--intuitive-names-grey-text)] bg-[var(--intuitive-names-grey-background)]">
                                            <p className="whitespace-pre-wrap">
                                                {isPending ? (
                                                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        {msg.content}
                                                    </span>
                                                ) : msg.content}
                                            </p>
                                            {msg.fallback && msg.status === "sent" && (
                                                <div className="text-xs text-amber-600 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                </div>
                                            )}
                                            {isError && (
                                                <div className="text-xs text-red-500 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {msg.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className="flex justify-end">
                                <div className="inline-flex items-start gap-1 px-4 py-2.5 rounded-3xl max-w-[calc(100%-48px)] bg-[var(--color-primary)] text-white">
                                    <p className="text-white">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Footer */}
            <footer className="px-6 mb-0 rounded-tl-[48px] bg-white sticky bottom-0 w-[90vw] lg:w-[60vw] inset-x-0 mx-auto flex flex-col gap-2 pt-4">
                <div className="flex items-center gap-4">
                    <div onClick={handleInputClick} className="flex-1 flex items-center justify-between px-5 py-2.5 rounded-[48px] border-[1.5px] border-solid">
                        <Input 
                            placeholder={isProfileLoading ? "Loading coach..." : `Ask about ${exercise.name}...`} 
                            onChange={handleInputChange} 
                            value={inputValue} 
                            onKeyDown={handleKeyDown} 
                            disabled={isSending || isProfileLoading || isMentalHealthLock}
                            className="border-0 p-0 h-auto shadow-none font-normal text-base leading-6 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Button size="icon" className="h-11 w-11 rounded-full" onClick={handleSendMessage} disabled={isSending || !inputValue.trim() || isProfileLoading || isMentalHealthLock}>
                        {isSending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" />}
                    </Button>
                </div>
                <p className="text-muted/50 mt-2 mb-0 p-0 leading-none">
                    Disclaimer: AI-generated content. Not a substitute for professional medical or fitness advice.
                    <a className={"ml-1 text-primary underline-offset-2 hover:underline hover:text-primary-hover active:text-primary-pressed"} href={`tel:1813`}>Dial support</a>
                </p>
            </footer>
        </div>
    );
}
