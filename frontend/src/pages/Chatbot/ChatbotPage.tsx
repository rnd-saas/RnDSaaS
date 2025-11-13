import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, MoreVertical, Send} from "lucide-react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import {Input} from "@/components/ui/input.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import AvatarIcon from "@/components/avatarIcon.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {useEffect, useRef, useState} from "react";
interface ChatMessage {
    type: "user" | "bot";
    content: string;
    avatar?: string;
}
export default function ChatbotPage() {
    //getting the user's trainer
    const { state } = useLocation() as { state?: { trainerId?: number } };
    const trainer = state?.trainerId ?? localStorage.getItem("trainer") ?? 0;

    //array of messages to be displayed
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([ //todo: get from somewhere
        { type:"user", content: "Message by user" },
        { type:"bot", content:"very long Response by bot very long Response by bot very long Response by bot very long Response by bot very long Response by bot" },
        { type:"user", content: "Very long Message by user Very long Message by user Very long Message by user Very long Message by user Very long Message by user" },
        { type:"bot", content:"Response by bot" },
    ]);

    //processing user input
    const [inputValue, setInputValue] = useState<string>('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleSendMessage = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue !== '') {
            const newMessage: ChatMessage = {
                type: "user",
                content: trimmedValue
            };
            setChatMessages(prevMessages => [...prevMessages, newMessage]);
            setInputValue('');
            //todo: logic to send to API and get response should go here
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
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
    }, [chatMessages]);

    return (
        <div className="w-full min-w-[50vw] min-h-[90vh] relative flex flex-col">
            <header className="px-6 pt-11 pb-4">
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={handleGoBack}>
                        <ArrowLeft className="h-6 w-6"/>
                    </Button>
                    <div className="flex items-center gap-3">
                        <AvatarIcon icon={avatarPlaceholder}/>
                        <div className="flex flex-col gap-0.5">
                            <h2>{trainer === 0 ? "Tom" : "Sarah"}</h2>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded bg-[var(--intuitive-names-app-primary)]"/>
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
            <main className="flex-1 px-6 pt-8 h-full pb-[6rem] overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {chatMessages.map((message, index)=> {
                        if (message.type === "bot") {
                            return (
                                <div key={index} className="flex items-start gap-2">
                                    <AvatarIcon icon={avatarPlaceholder}/>
                                    <div className="flex items-start gap-2.5 p-4 rounded-[0px_24px_24px_24px] max-w-[calc(100%-56px)] text-[var(--intuitive-names-grey-text)] bg-[var(--intuitive-names-grey-background)]">
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (message.type === "user") {
                            return (
                                <div key={index} className="flex justify-end">
                                    <div className="inline-flex items-start gap-1 px-4 py-2.5 rounded-3xl max-w-[calc(100%-48px)] text-[var(--intuitive-names-app-background)] bg-[var(--intuitive-names-app-primary)]">
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="px-6 py-8 rounded-tl-[48px] fixed bottom-10 w-full md:max-w-xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center justify-between px-5 py-2.5 rounded-[48px] border-[1.5px] border-solid">
                        <Input placeholder="Type a message ... " onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyDown}
                            className="border-0 p-0 h-auto font-normal text-base leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Button size="icon" className="h-11 w-11 rounded-full" onClick={handleSendMessage}>
                        <Send className="h-[18px] w-[18px]" />
                    </Button>
                </div>
            </footer>
        </div>
    )
}
