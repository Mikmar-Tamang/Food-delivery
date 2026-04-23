import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomePage from "../HomePage";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-5 transition-all duration-300 
        ${open ? "w-64" : "w-16"}`}
      >
        <button onClick={() => setOpen(!open)} className="mb-6">
          ☰
        </button>

        <ul className="space-y-4">

          <li onClick={() => setActive("home")} className="cursor-pointer">
            🏠 {open && "Home"}
          </li>

          <li onClick={() => setActive("profile")} className="cursor-pointer">
            👤 {open && "Profile"}
          </li>

          <li onClick={() => setActive("orders")} className="cursor-pointer">
            🛒 {open && "Orders"}
          </li>

          <li onClick={() => setActive("basket")} className="cursor-pointer">
            🧺 {open && "Basket"}
          </li>

        </ul>

        <button
          onClick={logout}
          className="mt-8 bg-red-600 w-full py-2 rounded-lg"
        >
          {open && "Logout"}
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 bg-gray-100">

        {/* HOME */}
        {active === "home" && (
          // <div>
          //   <h1 className="text-2xl font-bold">Welcome 👋</h1>
          //   <p className="mt-2 text-gray-600">
          //     This is your dashboard overview.
          //   </p>
          // </div>
          <HomePage />
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="mb-3">
                <label>Name</label>
                <input className="w-full border p-2 rounded mt-1" />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input className="w-full border p-2 rounded mt-1" />
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Update Profile
              </button>
            </div>
          </div>
        )}

        {/* BASKET */}
        {active === "basket" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Basket</h1>

            <div className="bg-white p-4 rounded shadow mb-3">
              🍔 Burger - Rs 200
            </div>

            <div className="bg-white p-4 rounded shadow mb-3">
              🍕 Pizza - Rs 500
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded mt-4">
              Place Order
            </button>
          </div>
        )}

        {/* ORDERS */}
        {active === "orders" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Orders</h1>

            {/* Current */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Current Orders</h2>
              <div className="bg-white p-4 rounded shadow">
                🍔 Burger - On the way 🚚
              </div>
            </div>

            {/* Previous */}
            <div>
              <h2 className="font-semibold mb-2">Previous Orders</h2>
              <div className="bg-white p-4 rounded shadow">
                🍕 Pizza - Delivered ✅
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;