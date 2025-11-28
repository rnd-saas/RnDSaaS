import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
type LoginDialogProps = {
  onSwitchToRegister: () => void;
};
type Inputs = {
  email: string;
  password: string;
};
export default function LoginDialog({ onSwitchToRegister }: LoginDialogProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data: { email: string; password: string }) => {
    const userData = { email: "sample@sample.com", password: "sample" }; //should get from backend
    if (userData && userData.password === data.password) {
      alert(userData.email + " You Are Successfully Logged In");
      navigate("/dashboard");
    } else {
      alert("Email or Password is not matching with our record");
    }
  };

  return (
    <DialogContent
      className={"bg-[var(--color-background)] rounded-lg shadow-md"}
    >
      <DialogHeader>
        <DialogTitle>Login Form</DialogTitle>
      </DialogHeader>

      <form
        className="Login max-w-sm p-6 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium text-left">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">
              *Email is mandatory
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium text-left">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">
              *Password is mandatory
            </span>
          )}
          <Link
            to={"/"}
            style={{
              fontSize: "14px",
              display: "block",
              textAlign: "left",
              color: "var(--color-link)",
            }}
          >
            Forgot password?
          </Link>
        </div>
        <Button variant={"default"} type="submit">
          Login
        </Button>
      </form>
      <DialogFooter className="!justify-start">
        <div className="flex flex-col items-start gap-2">
          <p>Don't have an account yet?</p>
          <Button variant="secondary" onClick={onSwitchToRegister}>
            Register
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
