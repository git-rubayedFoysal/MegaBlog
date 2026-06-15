import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login as storeLogin } from "../features/authSlice";
import { Logo, Input, Button } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(storeLogin(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <div className="w-full max-w-md card">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-xs">
            <Logo width="100%" />
          </span>
        </div>

        <h1 className="text-center text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-gray-400">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              {...register("password", { required: true })}
            />

            <Button type="submit" className="w-full btn-primary cursor-pointer">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
