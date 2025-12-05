import {useNavigate} from "react-router-dom";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";

export default function OnboardingInvitePage() {
    const navigate = useNavigate();
    const avatarSrc = tomImage;
    const name = "Tom";

    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);
    return (
        <div className="flex flex-col items-center justify-between">
            <header className="my-10 text-center">
                <h1 className="h1-styles">Glad to have you!</h1>
                <p>
                    You're on the way to your fitness goals.
                    <br/>
                    To help you along the way, we need to ask a few questions.
                </p>
            </header>
            <main className="flex-1 flex items-center justify-center w-full">
                <img
                    src={avatarSrc}
                    alt={`${name} waving`}
                    className="max-h-[55vh]"
                />
            </main>
            <footer className="w-full max-w-xs space-y-8 my-5 flex flex-col items-center justify-center text-center">
                <Button onClick={() => navigate("/onboarding")}>
                    Take onboarding?
                </Button>
                <Button variant={"link"} onClick={() => navigate("/dashboard")}>
                    Not now <br/> (you can still take it from settings later)
                </Button>
            </footer>
        </div>
    );
}