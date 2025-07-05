import { LoginSchema } from "../schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

const LoginPage = () => {
  const { authUser, isLoggingIn, login } = useAuthStore();
  const { adminUser, isAdminLoggingIn, adminLogin } = useAdminAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (authUser) {
      navigation("/", { replace: true });
    }
  }, [authUser]);

  useEffect(() => {
    if (adminUser) {
      navigation("/admin", { replace: true });
    }
  }, [adminUser]);

  const onSubmit = async (data) => {
    try {
      if (isStudent) {
        await login(data);
      } else {
        await adminLogin(data);
      }
      // NO navigation here
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg border bg-base-100">
        <h2 className="text-white text-center text-2xl">
          Login as {isStudent ? "Student" : "Admin"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsStudent(true)}
            className={`btn ${isStudent ? "btn-primary" : "btn-outline"}`}
          >
            Student
          </button>
          <button
            onClick={() => setIsStudent(false)}
            className={`btn ${!isStudent ? "btn-primary" : "btn-outline"}`}
          >
            Admin
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40 " />
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
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`input input-bordered w-full pl-4 pr-10 ${
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
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            disabled={isLoggingIn || isAdminLoggingIn}
            type="submit"
            className="btn btn-primary w-full"
          >
            {isLoggingIn || isAdminLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              `Login as ${isStudent ? "Student" : "Admin"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
