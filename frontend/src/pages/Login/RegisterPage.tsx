import { useForm } from "react-hook-form";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import { authService, ApiError } from "@/lib/api";

type Inputs = {
    email: string
    username: string
    password: string
    passwordConfirmation: string
}
function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit = async (data: { email: string; username: string; password: string; passwordConfirmation: string}) => {
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await authService.register({
                email: data.email,
                password: data.password,
                username: data.username,
                display_name: data.username,
            });

            setSuccess(true);

            if (response.needsEmailConfirmation) {
                // Give users a moment to read the confirmation notice before continuing onboarding
                setTimeout(() => navigate('/onboarding', { state: { needsEmailConfirmation: true } }), 1200);
            } else {
                navigate('/onboarding');
            }
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.message.includes('already exists') || err.message.includes('already registered')) {
                    setError('Email is already registered!');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const password = watch("password");

    return (
        <>
            {/*todo: standardise fonts*/}
            <h2 style={{ fontFamily: "var(--title-font-font-family)" }}>Registration Form</h2>

            <form
                // todo: standardise rounding and shadow
                className="Register max-w-sm bg-[var(--intuitive-names-app-background)] p-6 rounded-lg shadow-md space-y-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium text-left">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", {required: true})}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mt-1">*Email is mandatory</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="username" className="mb-1 font-medium text-left">Username</label>
                    <input
                        id="username"
                        type="username"
                        {...register("username", {required: true})}
                        placeholder="Enter your username"
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm mt-1">*Username is mandatory</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 font-medium text-left">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", {required: true})}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm mt-1">*Password is mandatory</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="passwordConfirmation" className="mb-1 font-medium text-left">Password
                        Confirmation</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        {...register("passwordConfirmation", {
                            required: true,
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })}
                        placeholder="Repeat your password"
                    />
                    {errors.passwordConfirmation && (
                        <span className="text-red-500 text-sm mt-1">*Passwords should match</span>
                    )}
                    {error && (
                        <span className="text-red-500 text-sm mt-1">{error}</span>
                    )}
                    {success && (
                        <span className="text-green-500 text-sm mt-1">Registration successful! Please check your email to verify your account.</span>
                    )}
                </div>
                <Button variant={"default"} type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </Button>
            </form>
            <div className={'p-6'}>
                <Link to={'/login'} style={{color: "var(--intuitive-names-secondary-text)"}}>Already an existing
                    user?</Link>
            </div>
        </>
    );
}

export default Register;