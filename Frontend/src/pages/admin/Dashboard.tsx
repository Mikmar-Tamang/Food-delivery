import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post(import.meta.env.VITE_API_URL +"/api/auth/logout", {}, {
      withCredentials: true,
    });

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        <ul className="space-y-2">
          <li>👤 Profile</li>
          <li>🛒 Orders</li>
          <li>🧺 Basket</li>
        </ul>

        <button
          onClick={logout}
          className="mt-6 bg-red-600 w-full py-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">
          Welcome 👋
        </h1>
      </main>

    </div>
  );
};

export default Dashboard;