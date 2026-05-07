import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { PartnerRegisterForm } from "../../types/auth.types";

// Updated schema - remove restaurantPp from Yup validation
const schema: yup.ObjectSchema<Omit<PartnerRegisterForm, 'restaurantPp'>> = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  restaurantName: yup.string().required("Restaurant name is required"),
  restaurantAddress: yup.string().required("Restaurant address is required"),
  // restaurantPp removed from Yup validation - handle it separately
});

// Fixed component name - PascalCase
const PartnerForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<PartnerRegisterForm, 'restaurantPp'>>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: Omit<PartnerRegisterForm, 'restaurantPp'>) => {
    // Get the file input element
    const fileInput = document.getElementById('restaurantPp') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    console.log("File selected:", file);
    
    if (!file) {
      alert("Restaurant profile picture is required");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('restaurantName', data.restaurantName);
    formData.append('restaurantAddress', data.restaurantAddress);
    formData.append('restaurantPp', file);


    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/auth/food-partner/register", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.setItem("email", data.email);
      navigate("/partner-notice");
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error appropriately
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
              {...register("name")}
              placeholder="Name"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
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

          <div>
            <input
              {...register("restaurantName")}
              placeholder="Restaurant Name"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.restaurantName?.message}</p>
          </div>

          <div>
            <input
              {...register("restaurantAddress")}
              placeholder="Restaurant Address"
              className="input"
            />
            <p className="text-red-500 text-sm">{errors.restaurantAddress?.message}</p>
          </div>

          <div>
            <input
              id="restaurantPp"
              type="file"
              accept="image/*"
              className="input"
            />
            {/* Manual validation for file */}
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        <p onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
          Already have an account? Login
        </p>
        <p onClick={() => navigate("/user-register")} className="text-blue-500 hover:underline">
          Register as User.
        </p>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;