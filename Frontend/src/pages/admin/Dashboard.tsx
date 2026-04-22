import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // 🔥 Logout API
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

      {/* 🔥 Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-5 transition-all duration-300 
        ${open ? "w-64" : "w-16"}`}
      >

        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white mb-6"
        >
          ☰
        </button>

        {/* Menu */}
        <ul className="space-y-4">

          <li>
            <NavLink
              to="/admin/profile"
              className="hover:text-gray-300"
            >
              👤 {open && "Profile"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/orders"
              className="hover:text-gray-300"
            >
              🛒 {open && "Orders"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/basket"
              className="hover:text-gray-300"
            >
              🧺 {open && "Basket"}
            </NavLink>
          </li>

        </ul>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-8 bg-red-600 w-full py-2 rounded-lg hover:bg-red-700"
        >
          {open && "Logout"}
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">
          Welcome 👋
        </h1>
      </main>

    </div>
  );
};

export default Dashboard;