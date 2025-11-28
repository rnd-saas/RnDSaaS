import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


export type SubscriptionSettings = {
    subscriptionType:number,
    card:string
}

export default function SubscriptionSettings() {
    const validityDate = new Date()
    const navigate = useNavigate();

    return (
        <div className="text-left">
            Your subscription is valid until {validityDate.toLocaleDateString()}<br/>
            <Button onClick={() => navigate("/")} className={"mt-4"}>Renew subscription</Button>
        </div>
    );
}