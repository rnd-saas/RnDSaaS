import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};
function Login() {
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
    } else {
      alert("Email or Password is not matching with our record");
    }
  };

  return (
    <>
      {/*todo: standardise fonts*/}
      <h2 style={{ fontFamily: "var(--title-font-font-family)" }}>
        Login Form
      </h2>

      <form
        // todo: standardise rounding and shadow
        className="Login max-w-sm bg-[var(--intuitive-names-app-background)] p-6 rounded-lg shadow-md space-y-4"
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
            <span className="text-red-500 text-xs mt-1">
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
            <span className="text-red-500 text-xs mt-1">
              *Password is mandatory
            </span>
          )}
          {/*will need to implement properly with backend*/}
          <Link
            to={"/"}
            style={{
              fontSize: "14px",
              display: "block",
              textAlign: "left",
              color: "var(--intuitive-names-secondary-text)",
            }}
          >
            Forgot password?
          </Link>
        </div>
        <Button variant={"default"} type="submit">
          Login
        </Button>
      </form>
      <div className={"p-6"}>
        <p>Don't have an account yet?</p>
        <Button variant={"secondary"} onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>
    </>
  );
}

export default Login;
