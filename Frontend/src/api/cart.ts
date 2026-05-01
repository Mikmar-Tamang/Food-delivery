import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ➕ Add to cart
export const addToCart = async (foodId: string, quantity = 1) => {
  return await axios.post(`${API}/api/cart/add`, {
    foodId,
    quantity,
  }, { withCredentials: true });
};

// 📦 Get cart
export const getCart = async () => {
  return await axios.get(`${API}/api/cart`, { withCredentials: true });
};

// ❌ Remove item
export const removeFromCart = async (foodId: string) => {
  return await axios.delete(`${API}/api/cart/remove`, {
    data: { foodId },
    withCredentials: true,
  });
};