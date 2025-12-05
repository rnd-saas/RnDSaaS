import { Button } from "@/components/ui/button.tsx";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Settings"
      className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
      onClick={() => navigate("/settings")}
    >
      <Settings className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90" />
    </Button>
  );
}
