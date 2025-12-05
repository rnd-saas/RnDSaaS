import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import sarahImage from "@/assets/onboarding_welcome/onboarding-sarah.png";
import {useEffect} from "react";

export default function LandingPage() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: { trainerId?: number; firstName?: string } };

    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);

    console.log("LandingPage state:", state);
    console.log("LandingPage localStorage.firstName:", localStorage.getItem("firstName"));

  // Prefer router state; fall back to localStorage; default to Tom (0)
  const trainerId =
    state?.trainerId ?? (Number(localStorage.getItem("trainerId")) || 0);

  const firstName =
    state?.firstName ?? localStorage.getItem("firstName") ?? "Friend";

  const avatarSrc = trainerId === 1 ? sarahImage : tomImage;
  const name = trainerId === 1 ? "Sarah" : "Tom";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between px-6 py-10">
      {/* Top greeting */}
      <header className="mt-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hi, {firstName} !</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Great to see you back
        </p>
      </header>

      {/* Avatar */}
      <main className="flex-1 flex items-center justify-center w-full">
        <img
          src={avatarSrc}
          alt={`${name} waving`}
          className="max-h-[55vh] object-contain"
        />
      </main>

      {/* Actions */}
      <footer className="w-full max-w-xs space-y-4 mb-10">
        <Button
          className="w-full rounded-2xl h-12 text-sm"
          /*</footer>onClick={() => navigate("/dashboard",  { state: { firstName, trainerId } })}*/
        >
          Ready to work out?
        </Button>
        <button
          type="button"
          className="w-full h-10 text-sm text-muted-foreground"
          onClick={() => navigate("/dashboard")}
        >
          Not now, I need a sec
        </button>
      </footer>
    </div>
  );
}
