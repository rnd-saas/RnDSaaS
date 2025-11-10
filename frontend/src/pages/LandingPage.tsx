// src/pages/LandingPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import sarahImage from "@/assets/onboarding_welcome/onboarding-sarah.png";

// If you don't already have a global declaration for pngs, add one project-wide:
// src/types/assets.d.ts -> declare module "*.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { trainerId?: number; firstName?: string } };

  console.log("LandingPage state:", state);
    console.log("LandingPage localStorage.firstName:", localStorage.getItem("firstName"));

  // Prefer router state; fall back to localStorage; default to Tom (0)
  const trainerId =
        state?.trainerId ??
        (Number(localStorage.getItem("trainerId")) || 0);

    const firstName = state?.firstName ?? localStorage.getItem("firstName") ?? "Friend";

  const avatarSrc = trainerId === 1 ? sarahImage : tomImage;
  const name = trainerId === 1 ? "Sarah" : "Tom";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between bg-[#F6FAF8] px-6 py-10">
      {/* Top greeting */}
      <header className="mt-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hi, {firstName} !</h1>
        <p className="mt-2 text-lg text-muted-foreground">Great to see you back</p>
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
          className="w-full rounded-2xl h-12 text-base"
          /*</footer>onClick={() => navigate("/dashboard")}*/
        >
          Ready to work out?
        </Button>
        <button
          type="button"
          className="w-full h-10 text-base text-muted-foreground"
          onClick={() => navigate("/dashboard")}
        >
          Not now, I need a sec
        </button>
      </footer>
    </div>
  );
}
