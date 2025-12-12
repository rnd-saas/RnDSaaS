import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur md:bottom-4 md:left-auto md:right-4 md:w-80 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-sm">Install App</h3>
        <p className="text-xs text-muted-foreground">Add to home screen for the best experience</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleInstallClick} className="gap-2 h-8">
          <Download className="h-3.5 w-3.5" />
          Install
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}