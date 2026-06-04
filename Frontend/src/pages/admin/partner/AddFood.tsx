// frontend/src/components/partner/AddFoodForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

interface AddFoodFormData {
  name: string;
  price: number;
  description: string;
  image: FileList;
}

//  Type the mixed() file field properly
const schema: yup.ObjectSchema<AddFoodFormData> = yup.object({
  name: yup.string().required("Food name is required"),
  price: yup.number().positive("Price must be positive").required("Price is required"),
  description: yup.string().required("Description is required"),
  image: yup.mixed<FileList>().required("Image is required"), // Key fix: Use mixed<FileList>()
});

const AddFood= ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddFoodFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AddFoodFormData): Promise<void> => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      reset();
      onSuccess();
      alert("Food item added successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to add food item");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Food Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Chicken Burger"
        />
        <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price (₨)
        </label>
        <input
          {...register("price")}
          type="number"
          step="0.01"
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., 299"
        />
        <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Describe your food item..."
        />
        <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Food Image
        </label>
        <input
          {...register("image")}
          type="file"
          accept="image/*"
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.image?.message}</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50 transition"
      >
        {loading ? "Adding..." : "Add Food Item"}
      </button>
    </form>
  );
};

export default AddFood;