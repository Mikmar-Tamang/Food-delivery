
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
    await axios.post(import.meta.env.VITE_API_URL+"/api/auth/user/register", data, {
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