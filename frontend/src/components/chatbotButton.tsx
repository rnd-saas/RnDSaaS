import ChatbotIcon from "@/assets/chatbotIcon.svg?react";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

export default function ChatbotButton({ variant = "primary", ...props }) {
    const colorStyle =
        variant === "primary"
            ? {color: "var(--intuitive-names-app-background)" }
            : {color: "black" };
    const navigate = useNavigate();
    return (
        <Button
            {...props}
            variant={variant === "primary" ? "default" : "secondary"}
            className="fixed bottom-10 right-10 rounded-full h-12 w-12 p-0 flex items-center justify-center z-50"
            style={colorStyle}
            onClick={() => navigate("/chatbot")}
        >
            <ChatbotIcon />
        </Button>
    );
}