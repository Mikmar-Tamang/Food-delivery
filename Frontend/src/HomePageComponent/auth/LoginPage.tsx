
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup"

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const[serverError, setServerError]= useState("");
//   const [error, setError] = useState<{
//     email?: string,
//     password?:string
//   }>({})

//   const loginSchema= yup.object({
//     email:yup
//     .string()
//     .required("email required")
//     .email("Invalid email"),

//     password:yup
//     .string()
//     .required("password required")
//     .min(6, "password must be at least 6 - 12 characters")
//     .max(12, "Maximum password characters has reached out")
//   })

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();

//   try {

//    await loginSchema.validate(
//     {email, password}, {abortEarly: false}
//    )

//     const res = await axios.post(
//       "http://localhost:5000/api/auth/user/login",
//       { email, password },
//       { withCredentials: true }
//     );

//     alert(res.data.message);
//     navigate("/");
//   } catch (err: unknown) {
//   // 1. Yup validation error
//   if (err instanceof yup.ValidationError) {
//     const newErrors: Record<string, string> = {};

//     err.inner.forEach((error) => {
//       if (error.path) {
//         newErrors[error.path] = error.message;
//       }
//     });

//     setError(newErrors);
//     return;
//   }

//   // 2. Backend error (Axios)
//   if (axios.isAxiosError<{ message: string }>(err)) {
//   setServerError(err.response?.data?.message ?? "Invalid email or password");
//   return;
// }

//   // 3. Unknown error
//   console.error(err);
//   alert("Something went wrong");
// }
// };

//   return (
//     <div className="h-screen flex justify-center items-center bg-blue-500">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-md shadow-md w-87.5"
//         noValidate
//       >
//         <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border rounded-[5px] p-2 mb-2"
//           value={email}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//           required
//         />
//          {error.email && (
//   <p className="text-red-500 font-bold text-sm">
//     {error.email}
//   </p>
// )}
      
//         {serverError && (
//   <p className="text-red-500 font-bold text-sm ">
//     {serverError}
//   </p>
// )}

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border rounded-[5px] p-2 my-3"
//           value={password}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//           required
//         />
//          {error.password && (
//   <p className="text-red-500 font-bold text-sm">
//     {error.password}
//   </p>
// )}

// {serverError && (
//   <p className="text-red-500 font-bold text-sm">
//     {serverError}
//   </p>
// )}

//         <button className="w-full bg-green-500 text-white p-2 mt-3 rounded">Login</button>

//         <p className="text-center mt-4">
//           Don't have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Register
//           </span>
//         </p>
//       </form>
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

const schema: yup.ObjectSchema<LoginForm> = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    await axios.post(import.meta.env.VITE_API_URL +"/api/auth/user/login", data, {
      withCredentials: true,
    });

    navigate("/admin");
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

          <button className="btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;