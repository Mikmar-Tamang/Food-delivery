// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import type { RegisterForm } from "../../types/auth.types";

// const schema: yup.ObjectSchema<RegisterForm> = yup.object({
//   username: yup.string().required("Username is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().min(6).required("Password is required"),
// });

// const UserForm = () => {
//   const navigate = useNavigate();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterForm>({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: RegisterForm) => {
//     await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/register", data, {
//       withCredentials: true,
//     });

//     localStorage.setItem("email", data.email);
//     setTimeout(() => {
//       navigate("/verify-notice");
//     }, 100);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">

//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Create Account
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//           <div>
//             <input
//               {...register("username")}
//               placeholder="Username"
//               className="input"
//             />
//             <p className="text-red-500 text-sm">{errors.username?.message}</p>
//           </div>

//           <div>
//             <input
//               {...register("email")}
//               placeholder="Email"
//               className="input"
//             />
//             <p className="text-red-500 text-sm">{errors.email?.message}</p>
//           </div>

//           <div>
//             <input
//               {...register("password")}
//               type="password"
//               placeholder="Password"
//               className="input"
//             />
//             <p className="text-red-500 text-sm">{errors.password?.message}</p>
//           </div>

//           <button className="btn">
//             Register
//           </button>

//         <p onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
//           Already have an account? Login
//         </p>
//         <p onClick={() => navigate("/partner-register")} className="text-blue-500 hover:underline">
//           Register as Partner.
//         </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { RegisterForm } from "../../types/auth.types";
import { useState } from "react";

const schema: yup.ObjectSchema<RegisterForm> = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const UserForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/register", data, {
        withCredentials: true,
      });

      localStorage.setItem("email", data.email);
      setTimeout(() => {
        navigate("/verify-notice");
      }, 100);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <button 
            type="submit" 
            className="btn w-full"
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
                <span>Creating account...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>

        <p onClick={() => navigate("/login")} className="text-blue-500 hover:underline cursor-pointer">
          Already have an account? Login
        </p>
        <p onClick={() => navigate("/partner-register")} className="text-blue-500 hover:underline cursor-pointer">
          Register as Partner.
        </p>
        </form>
      </div>
    </div>
  );
};

export default UserForm;