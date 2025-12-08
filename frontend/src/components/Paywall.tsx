import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api/client";
import { authService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function Paywall({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
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

    if (isSubscribed === null) {
        return null; // Or a loading spinner
    }

    if (!isSubscribed) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-6 text-center space-y-6">
                <div className="bg-green-50 p-4 rounded-full">
                    <Lock className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Subscription Required</h2>
                    <p className="text-gray-500 max-w-md">
                        This feature is only available to Premium members. Upgrade your plan to unlock unlimited access to all features.
                    </p>
                </div>
                <Button 
                    onClick={() => navigate('/subscription')}
                    className="w-full max-w-xs bg-green-600 hover:bg-green-700"
                >
                    Upgrade to Premium
                </Button>
            </div>
        );
    }

    return <>{children}</>;
}
