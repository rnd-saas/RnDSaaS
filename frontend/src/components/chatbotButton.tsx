import ChatbotIcon from "@/assets/chatbotIcon.svg?react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ChatbotButton({
  variant = "default",
  className,
  ...props
}: {
  variant?: "default" | "secondary";
  className?: string;
} & React.ComponentProps<typeof Button>) {
  const colorStyle =
    variant === "default"
      ? { color: "var(--color-background)" }
      : { color: "black" };
  const navigate = useNavigate();
  return (
    <>
      <Button
        {...props}
        variant={variant === "default" ? "default" : "secondary"}
        className={cn(
          "rounded-full h-12 w-12 p-0 flex items-center justify-center",
          className
        )}
        style={colorStyle}
        onClick={() => navigate("/chatbot")}
      >
        <ChatbotIcon />
      </Button>
    </>
  );
}
