
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import type { LoginForm } from "../../types/auth.types";
// import { useState } from "react";
// import { AxiosError } from "axios";
// import { ErrorResponse } from "../../types/api.types";

// const schema: yup.ObjectSchema<LoginForm> = yup.object({
//   email: yup.string().email().required(),
//   password: yup.string().min(6).required(),
// });

// const LoginPage = () => {
 
//   const [showResendVerification, setShowResendVerification] = useState(false);
//   const [userEmail, setUserEmail] = useState("");

//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginForm>({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: LoginForm) => {
//   setUserEmail(data.email);

//     try {
//     await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/login", data, {
//       withCredentials: true,
//     });

//     navigate("/dashboard");
//   } catch (error) {
//     const err = error as AxiosError<ErrorResponse>;
//    if(err.response?.data?.allowResendVerification) {
//     setShowResendVerification(true);
//    }
    
//   }
// };

// const handleResendVerification = async () => {
//   try {
//     await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/resend-verification",
//        {email: userEmail});
//   } catch (error) {
//     console.error("Error resending verification email:", error);
//   }
// };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">

//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Login
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//           <input {...register("email")} placeholder="Email" className="input" />
//           <p className="text-red-500 text-sm">{errors.email?.message}</p>

//           <input
//             {...register("password")}
//             type="password"
//             placeholder="Password"
//             className="input"
//           />
//           <p className="text-red-500 text-sm">{errors.password?.message}</p>

//           {showResendVerification && (
//             <p className="text-yellow-500 text-sm">
//               Please verify your email.{" "}
//               <button
//                 type="button"
//                 className="text-blue-500 underline"
//                 onClick={handleResendVerification}
//               >
//                 Resend Verification Email
//               </button>
//             </p>
//           )}

//           <button className="btn">
//             Login
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <b onClick={() => navigate('/user-register')} className="text-blue-500 hover:underline">
//               Sign up
//             </b>
//           </p>
            
//           <p className="text-center text-sm text-gray-600">
//             Login as Food Partner{" "}
//             <b onClick={() => navigate('/food-partner-login')} className="text-blue-500 hover:underline">
//               here
//             </b>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true); // Start loading

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/auth/user/login", data, {
        withCredentials: true,
      });
      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data?.allowResendVerification) {
        setShowResendVerification(true);
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/auth/user/resend-verification", {
        email: userEmail,
      });
      alert("Verification email sent! Please check your inbox.");
      setShowResendVerification(false);
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">Login to continue ordering food</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>}
          </div>

          {/* Verification Warning */}
          {showResendVerification && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-yellow-700 text-sm">
                Please verify your email address before logging in.
              </p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 underline disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )}

          {/* Modern Loading Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-[1.02] active:scale-[0.98] text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                {/* Modern spinner */}
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/user-register")}
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition"
            >
              Sign up
            </button>
          </p>

          {/* Food Partner Link */}
          <p className="text-center text-sm text-gray-600">
            Login as Food Partner{" "}
            <button
              type="button"
              onClick={() => navigate("/food-partner-login")}
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition"
            >
              here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;