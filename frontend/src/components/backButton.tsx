import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function BackButton(){
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    return(
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={handleGoBack}>
            <ArrowLeft className="h-6 w-6"/>
        </Button>
    );
}