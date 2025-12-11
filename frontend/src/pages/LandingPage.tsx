import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import sarahImage from "@/assets/onboarding_welcome/onboarding-sarah.png";
import {useEffect, useState} from "react";
import Paywall from "@/components/Paywall";
import apiClient from "../lib/api/client";
import {authService} from "@/lib/api";

export default function LandingPage() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: { trainerId?: number; firstName?: string } };

    const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            // 1. Check local storage first for immediate feedback
            const localStatus = apiClient.getSubscriptionStatus();
            if (localStatus === 'active' || localStatus === 'trialing') {
                setIsSubscribed(true);
            }

            // 2. Verify with backend to get the latest status
            try {
                const user = await authService.getCurrentUser();
                const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing';
                setIsSubscribed(isActive);
            } catch (error) {
                console.error("Failed to verify subscription status", error);
                // If backend check fails, rely on local storage or default to false if not set
                if (isSubscribed === null) {
                    setIsSubscribed(false);
                }
            }
        };
        checkStatus();
    }, []);
    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);

    console.log("LandingPage state:", state);
    console.log("LandingPage localStorage.firstName:", localStorage.getItem("firstName"));

  // Prefer router state; fall back to localStorage; default to Tom (0)
  const trainerId =
    state?.trainerId ?? (Number(localStorage.getItem("trainerId")) || 1);

  const firstName =
    state?.firstName ?? localStorage.getItem("firstName") ?? "Friend";

  const avatarSrc = trainerId === 1 ? sarahImage : tomImage;
  const name = trainerId === 1 ? "Sarah" : "Tom";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between px-6 py-10">
      {/* Top greeting */}
      <header className="mt-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hi, {firstName} !</h1>
        {!isSubscribed&&
            <p className="mt-2 text-lg text-muted-foreground">
               Nice to meet you
            </p>
        }
          {isSubscribed&&
              <p className="mt-2 text-lg text-muted-foreground">
                  Great to see you back
              </p>
          }
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
          {!isSubscribed&&
      <Button
          className="w-full rounded-2xl h-12 text-sm"
          onClick={() => navigate("/subscription")}
      >
          Subscribe now
      </Button>}
          {isSubscribed&&
        <Button
          className="w-full rounded-2xl h-12 text-sm"
          onClick={() => navigate("/workout")}
        >
          Ready to work out?
        </Button>}
        <Button
          type="button" variant={"link"}
          className="w-full h-10 text-sm text-muted-foreground"
          onClick={() => navigate(isSubscribed?"/dashboard":"/profile")}
        >
          Not now, I need a sec
        </Button>
      </footer>
    </div>
  );
}
