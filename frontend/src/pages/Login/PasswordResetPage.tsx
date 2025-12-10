import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {authService} from "@/lib/api";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

type Inputs = {
    email: string
}

export default function PasswordResetPage(){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    
    const onSubmit = async (data: { email: string;}) => {
        setIsSubmitting(true);
        try {
            await authService.requestPasswordReset(data.email);
            setEmailSent(true);
            toast.success("Password reset email sent! Please check your inbox.");
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast.error(error?.message || "Failed to send password reset email. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        if ((window as any).tidioChatApi) {
            (window as any).tidioChatApi.hide();
        }
    }, []);
    
    if (emailSent) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                    <div className="mb-6 rounded-full bg-green-100 p-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                    <p className="text-muted-foreground mb-6">
                        We've sent you a password reset link. Please check your inbox and click the link to reset your password.
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Return to home
                    </Button>
                </div>
            </div>
        );
    }
    
    return(
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </header>
                <form className="w-full p-6 space-y-4 flex flex-col items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col w-full text-left">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Enter your email"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm justify-start mt-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <Button variant="default" type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send reset link"
                        )}
                    </Button>
                    <Button 
                        variant="ghost" 
                        type="button" 
                        onClick={() => window.location.href = '/'}
                        className="w-full"
                    >
                        Back to login
                    </Button>
                </form>
            </div>
        </div>
    );
}