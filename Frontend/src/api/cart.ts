import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ➕ Add to cart
export const addToCart = async (foodId: string, quantity = 1) => {
  return await axios.post(`${API}/cart/add`, {
    foodId,
    quantity,
  });
};

// 📦 Get cart
export const getCart = async () => {
  return await axios.get(`${API}/cart`);
};

// ❌ Remove item
export const removeFromCart = async (foodId: string) => {
  return await axios.delete(`${API}/cart/remove`, {
    data: { foodId },
  });
};