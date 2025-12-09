import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

type Inputs = {
    password: string
    passwordConfirmation: string
}
export default function PasswordChangePage(){
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const password = watch("password");
    const onSubmit = async (data: { password: string; passwordConfirmation: string }) => {
        console.log(data)
    };
    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);
    return(
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold">Change password</h1>
                </header>
                <form className="w-full p-6 space-y-4 flex flex-col items-center"
                      onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col">
                        <Label htmlFor="password" className="mb-1 font-medium text-left">Password</Label>
                        <Input
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
                        <Label htmlFor="passwordConfirmation" className="mb-1 font-medium text-left">Password
                            Confirmation</Label>
                        <Input
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
                    <Button variant="default" type="submit">
                        Confirm password change
                    </Button>
                </form>
            </div>
        </div>
    );
}