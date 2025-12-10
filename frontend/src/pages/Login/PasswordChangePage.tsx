import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {authService} from "@/lib/api";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

type Inputs = {
    password: string
    passwordConfirmation: string
}

export default function PasswordChangePage(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    
    const password = watch("password");
    
    useEffect(() => {
        if ((window as any).tidioChatApi) {
            (window as any).tidioChatApi.hide();
        }
        
        // Check for errors in URL hash (Supabase returns errors in hash fragment)
        const hash = window.location.hash.substring(1); // Remove the '#'
        const hashParams = new URLSearchParams(hash);
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
            const message = errorDescription 
                ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
                : 'Password reset link is invalid or has expired';
            toast.error(message);
            setTimeout(() => navigate('/password-reset'), 5000); // Give user time to read the error
            return;
        }
        
        // Check if we have the required tokens in URL
        // Supabase will add access_token and refresh_token to URL after email link click
        // Supabase often puts these in the hash fragment rather than the query string
        const queryAccessToken = searchParams.get('access_token');
        const queryRefreshToken = searchParams.get('refresh_token');

        const hashAccessToken = hashParams.get('access_token');
        const hashRefreshToken = hashParams.get('refresh_token');

        const accessToken = queryAccessToken || hashAccessToken;
        const refreshToken = queryRefreshToken || hashRefreshToken;
        
        if (!accessToken) {
            toast.error("Invalid or expired password reset link");
            setTimeout(() => navigate('/password-reset'), 5000);
            return;
        }
        
        // Store the token temporarily so apiClient can use it for the password update request
        localStorage.setItem('auth_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('auth_refresh_token', refreshToken);
        }
    }, [searchParams, navigate]);
    
    const onSubmit = async (data: { password: string; passwordConfirmation: string }) => {
        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        
        setIsSubmitting(true);
        try {
            await authService.updatePassword(data.password);
            setPasswordChanged(true);
            toast.success("Password updated successfully!");
            setTimeout(() => navigate('/'), 2000);
        } catch (error: any) {
            console.error("Password update error:", error);
            toast.error(error?.message || "Failed to update password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (passwordChanged) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                    <div className="mb-6 rounded-full bg-green-100 p-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Password changed!</h1>
                    <p className="text-muted-foreground mb-6">
                        Your password has been successfully updated. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }
    
    return(
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold">Set new password</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please enter your new password below.
                    </p>
                </header>
                <form className="w-full p-6 space-y-4 flex flex-col items-center"
                      onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col w-full">
                        <Label htmlFor="password" className="mb-1 font-medium text-left">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            placeholder="Enter your new password"
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col w-full">
                        <Label htmlFor="passwordConfirmation" className="mb-1 font-medium text-left">
                            Confirm Password
                        </Label>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            {...register("passwordConfirmation", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                            placeholder="Repeat your new password"
                            disabled={isSubmitting}
                        />
                        {errors.passwordConfirmation && (
                            <span className="text-red-500 text-sm mt-1 text-left">
                                {errors.passwordConfirmation.message}
                            </span>
                        )}
                    </div>
                    <Button variant="default" type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update password"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}