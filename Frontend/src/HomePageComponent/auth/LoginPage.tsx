
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { LoginForm } from "../../types/auth.types";
import { useState } from "react";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types/api.types";

const schema: yup.ObjectSchema<LoginForm> = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const LoginPage = () => {
 
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
  setUserEmail(data.email);

    try {
    await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/login", data, {
      withCredentials: true,
    });

    navigate("/admin");
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
   if(err.response?.data?.allowResendVerification) {
    setShowResendVerification(true);
   }
    
  }
};

const handleResendVerification = async () => {
  try {
    await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/resend-verification",
       {email: userEmail});
  } catch (error) {
    console.error("Error resending verification email:", error);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input {...register("email")} placeholder="Email" className="input" />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>

          {showResendVerification && (
            <p className="text-yellow-500 text-sm">
              Please verify your email.{" "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </button>
            </p>
          )}

          <button className="btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;