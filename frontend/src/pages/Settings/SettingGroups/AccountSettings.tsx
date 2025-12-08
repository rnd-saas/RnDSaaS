import {Button} from "@/components/ui/button";
import {logout as logoutService, deleteAccount as deleteAccountService} from "@/lib/api/authService";
import {clearUserId} from "@/lib/analytics";
import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ApiError} from "@/lib/api";

const LOCAL_STORAGE_KEYS_TO_CLEAR = ["trainerId", "firstName"];

const clearAllCookies = () => {
    if (typeof document === "undefined") return;
    document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        if (!name) return;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
};

export default function AccountSettings() {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const clearClientState = useCallback(() => {
        if (typeof window !== "undefined") {
            LOCAL_STORAGE_KEYS_TO_CLEAR.forEach((key) => {
                try {
                    window.localStorage.removeItem(key);
                } catch (_) {
                    // ignore storage failures
                }
            });

            try {
                window.sessionStorage.clear();
            } catch (_) {
                // ignore session storage failures
            }
        }

        clearAllCookies();
        try {
            clearUserId();
        } catch (_) {
            // ignore analytics failures
        }
    }, []);

    const handleLogout = useCallback(async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        setLogoutError(null);
        try {
            await logoutService();
        } catch (error: any) {
            setLogoutError(error?.message || "Failed to log out. Please try again.");
        } finally {
            clearClientState();
            setIsLoggingOut(false);
            navigate("/", { replace: true });
        }
    }, [clearClientState, isLoggingOut, navigate]);

    const handleDeleteAccount = useCallback(async () => {
        if (isDeleting) return;

        // Show confirmation dialog
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone. " +
            "All your data, including workouts, achievements, and settings, will be permanently deleted."
        );

        if (!confirmed) {
            return;
        }

        // Double confirmation for safety
        const doubleConfirmed = window.confirm(
            "This is your last chance. Are you absolutely sure you want to delete your account? " +
            "This action is permanent and cannot be reversed."
        );

        if (!doubleConfirmed) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteAccountService();
            // Clear all client state
            clearClientState();
            // Navigate to landing page
            navigate("/", { replace: true });
        } catch (error: any) {
            if (error instanceof ApiError) {
                setDeleteError(error.message || "Failed to delete account. Please try again.");
            } else {
                setDeleteError("Failed to delete account. Please try again.");
            }
            console.error("Delete account error:", error);
        } finally {
            setIsDeleting(false);
        }
    }, [clearClientState, isDeleting, navigate]);

    return (
        <div className="space-y-6 w-full max-w-xl">
            {/* Logout */}
            <div className="flex flex-col gap-2 w-full">
                {logoutError && (
                    <p className="text-sm text-red-500">{logoutError}</p>
                )}
                <Button
                    id="logout"
                    className="mr-4 w-fit"
                    variant={"link"}
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
            </div>
            {/* Delete account */}
            <div className="flex flex-col gap-2 w-full">
                {deleteError && (
                    <p className="text-sm text-red-500">{deleteError}</p>
                )}
                <div className="flex items-center justify-between w-full">
                    <Button 
                        id="delete-account" 
                        variant="link"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                    >
                        {isDeleting ? "Deleting account..." : "Delete account"}
                    </Button>
                </div>
            </div>
        </div>
    );
}