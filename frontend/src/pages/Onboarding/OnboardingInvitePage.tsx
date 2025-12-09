import {useNavigate} from "react-router-dom";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import {Button} from "@/components/ui/button";
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
            <main className="flex-1 flex flex-col items-center justify-center max-w-[70vw] lg:max-w-[40vw]">
                <img
                    src={avatarSrc}
                    alt={`${name} waving`}
                    className="max-h-[30vh]"
                />
                <p>
                    Our app offers you personalised workout plans, helpful advice from a supportive virtual fitness
                    buddy, as well as giving you the opportunity to track your anxiety levels at the gym so you can see
                    your confidence improve as you go along your fitness journey.
                    We only ask for €5 a month, making this a very affordable way to get started on your journey to self-improvement.
                </p>
            </main>
            <footer className="sticky bottom-0 w-full max-w-xs space-y-3 bg-white my-5 flex flex-col items-center justify-center text-center">
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