
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Define the form data type
interface FoodPartnerLoginForm {
  email: string;
  password: string;
}

// Define error response type
interface ErrorResponse {
  message?: string;
}

const schema: yup.ObjectSchema<FoodPartnerLoginForm> = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
});

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodPartnerLoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FoodPartnerLoginForm) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post<{ message: string }>(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`,
        data,
        { withCredentials: true }
      );
      
      if (response.data.message === "Login successful") {
        navigate("/partner-dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Food Partner Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
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
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate("/partner-register")}
            className="text-green-500 hover:underline"
            type="button"
          >
            Register here
          </button>

          <p>Login as normal user <b onClick={() => navigate('/login')} className="cursor-pointer">here</b></p>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;