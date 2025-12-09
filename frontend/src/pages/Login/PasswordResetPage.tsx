import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
type Inputs = {
    email: string
}
export default function PasswordResetPage(){
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit = async (data: { email: string;}) => {
        console.log(data);
    };
    useEffect(() => {
        window.tidioChatApi.hide();
    }, []);
    return(
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col items-center text-center p-4">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                </header>
                <form className="w-full p-6 space-y-4 flex flex-col items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col w-full text-left">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm justify-start mt-1">*Email is mandatory</span>
                        )}
                    </div>
                    <Button variant="default" type="submit">
                        Request password reset
                    </Button>
                </form>

            </div>
        </div>
    );
}