// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup";

// const Register: React.FC = () => {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const [errors, setErrors] = useState<{
//   username?: string;
//   email?: string;
//   password?: string;
// }>({});

//   const registerSchema =  yup.object({
//     username:yup
//     .string()
//     .required("Username is required")
//     .min(3, "Username must be at least 3 characters"),

//     email:yup
//     .string()
//     .required("Email is required")
//     .email("Invalid email format"),

//     password:yup
//     .string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters")

//   })

//   const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();

//   try {
//     await registerSchema.validate(
//       { username, email, password },
//       { abortEarly: false }
//     );

//     const res = await axios.post(
//       "http://localhost:5000/api/auth/user/register",
//       { username, email, password },
//       { withCredentials: true }
//     );

//     alert(res.data.message);
//     navigate("/");
//   } catch (err: unknown) {
//     if (err instanceof yup.ValidationError) {
//       const newErrors: Record<string, string> = {};

//       err.inner.forEach((error) => {
//         if (error.path) {
//           newErrors[error.path] = error.message;
//         }
//       });

//       setErrors(newErrors);
//     } else {
//       console.error(err);
//       alert("Register failed");
//     }
//   }
// };

//   return (
//     <div className="h-screen flex justify-center items-center bg-purple-500">
//       <form
//         onSubmit={handleRegister}
//         className="bg-white p-8 rounded-md shadow-md w-87.5"
//         noValidate
//       >
//         <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full border p-2 mb-4"
//           value={username}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
//           required
//         />
//         {errors.username && (
//   <p className="text-red-500 text-sm mb-3">
//     {errors.username}
//   </p>
// )}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 mb-4"
//           value={email}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//           required
//         />
//         {errors.email && (
//   <p className="text-red-500 text-sm mb-3">
//     {errors.email}
//   </p>
// )}

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 mb-4"
//           value={password}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//           required
//         />
//         {errors.password && (
//   <p className="text-red-500 text-sm mb-3">
//     {errors.password}
//   </p>
// )}

//         <button className="w-full bg-blue-500 text-white p-2 rounded">Register</button>

//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { RegisterForm } from "../../types/auth.types";

const schema: yup.ObjectSchema<RegisterForm> = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await axios.post(import.meta.env.VITE_API_URL +"/api/auth/user/register", data, {
      withCredentials: true,
    });

    localStorage.setItem("email", data.email);
    navigate("/verify-notice");
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

          <button className="btn">
            Register
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;