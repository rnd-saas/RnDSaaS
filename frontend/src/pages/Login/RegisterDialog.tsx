import { useForm } from "react-hook-form";
import {Button} from "@/components/ui/button.tsx";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
type RegisterDialogProps = {
    onSwitchToLogin: () => void;
};
type Inputs = {
    email: string
    username: string
    password: string
    passwordConfirmation: string
}
export default function RegisterDialog({onSwitchToLogin}:RegisterDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit = (data: { email: string; username: string; password: string; passwordConfirmation: string}) => {
        const existingUser = {email:'sample@sample.com',username: 'sample', password:'sample'};// will need to get from backend
        if (existingUser.email == data.email || existingUser.username == data.username) {
            alert("User is already registered!");
        } else {
            //here will need to save new user to db
            alert(data.email + " has been successfully registered");
        }
    };

    const password = watch("password");

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Registration Form</DialogTitle>
            </DialogHeader>
            <form
                className="Register max-w-sm bg-[var(--color-background)] p-6 rounded-lg shadow-md space-y-4"
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
                    {errors.email && (
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
                </div>
                <Button variant={"default"} type="submit">Register</Button>
            </form>
            <DialogFooter className={'p-6'}>
                <Button variant={"link"}  onClick={onSwitchToLogin}>Already an existing user?</Button>
            </DialogFooter>
        </DialogContent>
    );
}
