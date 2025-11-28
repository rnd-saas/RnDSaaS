import {Button} from "@/components/ui/button.tsx";
import {Settings} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function SettingsButton(){
    const navigate = useNavigate();
    return(
        <Button variant={"outline"} aria-label="Settings" className="rounded-full border p-2 text-muted-foreground hover:bg-accent"
                onClick={() => navigate("/settings")}>
            <Settings/>
        </Button>
    );
}