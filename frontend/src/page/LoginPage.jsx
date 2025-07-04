import { LoginSchema } from "../schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { authUser, isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (authUser) navigation("/");
  }, [authUser, login]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      console.log(data);
      navigation("/");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-lg border ">
        <h2 className="text-white text-center text-2xl">LOGIN</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="email"
                {...register("email")}
                className={`input input-bordered w-full pl-10 ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="example@mail.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`input input-bordered w-full pl-10 ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder="•••••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-base-content/40" />
                ) : (
                  <Eye className="h-5 w-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="cursor-pointer label">
              <input type="checkbox" className="checkbox checkbox-sm" />
              <span className="ml-2 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            disabled={isLoggingIn}
            type="submit"
            className="btn btn-primary w-full"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-base-content/60">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
