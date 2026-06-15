import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login as storeLogin } from "../features/authSlice";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Logo, Button, Input } from "./index";

function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const user = await authService.createAccount(data);
      if (user) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(storeLogin(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error);
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
          Create Account
        </h1>
        <p className="mt-2 text-center text-gray-400">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              {error.message || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              type="text"
              {...register("name", { required: true })}
            />
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

            <Button
              type="submit"
              bgColor="bg-blue-600"
              textColor="text-white"
              className="w-full cursor-pointer"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
