import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle, ArrowLeft, Loader2, MoreVertical, Send} from "lucide-react";
import tomAvatar from "@/assets/tom_avatar.png";
import sarahAvatar from "@/assets/sarah_avatar.png";
import {Input} from "@/components/ui/input.tsx";
import {useNavigate} from "react-router-dom";
import AvatarIcon from "@/components/avatarIcon.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {chatbotService} from "@/lib/api";
import type {ChatbotMessage, ChatbotTrainerProfile} from "@/lib/api/types";

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

export default function ChatbotPage() {
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

    const trainerName = profile?.name ?? "Tom";
    const trainerAvatar = AVATAR_MAP[profile?.avatarKey ?? "tom"] ?? tomAvatar;
    const trainerId = profile?.trainerId ?? 0;

    const initGreeting = useCallback((name: string) => {
        if (greetingInitializedRef.current) return;
        greetingInitializedRef.current = true;
        setMessages([
            {
                id: createMessageId(),
                role: "assistant",
                status: "sent",
                content: `Hey, I'm ${name}. Tell me how your training feels today and I'll fine-tune the next session with you.`
            }
        ]);
    }, []);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                setProfileError(null);
                const data = await chatbotService.fetchProfile();
                if (!active) return;
                setProfile(data);
                initGreeting(data.name);
            } catch (error: any) {
                if (!active) return;
                console.error("Failed to load chatbot profile", error);
                setProfileError(error?.message ?? "Failed to load your coach profile.");
                initGreeting("your coach");
            } finally {
                if (active) {
                    setIsProfileLoading(false);
                }
            }
        };

        loadProfile();

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
                    language: preferredLanguage
                }
            });

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

    return (
        <div className="w-full min-w-[50vw] min-h-[90vh] relative flex flex-col">
            <header className="px-6 pt-11 pb-4">
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
                                <p> Always active</p>
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
                            <DropdownMenuItem>
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
                                <div key={message.id} className="flex items-start gap-2">
                                    <AvatarIcon icon={trainerAvatar}/>
                                    <div className="flex flex-col gap-2 p-4 rounded-[0px_24px_24px_24px] max-w-[calc(100%-56px)] text-[var(--intuitive-names-grey-text)] bg-[var(--intuitive-names-grey-background)]">
                                        <p>{message.status === "pending" ? (
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
            <footer className="px-6 py-8 rounded-tl-[48px] fixed bottom-10 w-[90vw] lg:w-[60vw] inset-x-0 mx-auto">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center justify-between px-5 py-2.5 rounded-[48px] border-[1.5px] border-solid">
                        <Input placeholder={isProfileLoading ? "Loading coach..." : "Type a message ... "} onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyDown} disabled={isSending || isProfileLoading}
                            className="border-0 p-0 h-auto font-normal text-base leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Button size="icon" className="h-11 w-11 rounded-full" onClick={handleSendMessage} disabled={isSending || !inputValue.trim() || isProfileLoading}>
                        {isSending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" />}
                    </Button>
                </div>
            </footer>
        </div>
    )
}
