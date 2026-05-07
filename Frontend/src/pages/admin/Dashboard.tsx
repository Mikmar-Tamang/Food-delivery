import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Basket } from "../../types/baseket";
import { User } from "../../types/user.ts";

const Dashboard = () => {

  const [user, setUser] = useState<User | null>(null);

  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("profile");


  const [basket, setBasket] = useState<Basket | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/auth/user/me",
        { withCredentials: true }
      );

      setUser(res.data.user);

    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  const logout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const fetchBasket = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/cart",
        { withCredentials: true }
      );

      setBasket(res.data.basket);
    } catch (err) {
      console.log(err);
    }
  };

  fetchBasket();
}, []);

const menuItems = {
  USER: ["profile", "orders", "basket"],

  ADMIN: [
    "dashboard",
    "users",
    "partners"
  ]
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

          <li onClick={() => navigate("/")} className="cursor-pointer">
            Home
          </li>

          {user &&
  menuItems[user.role]?.map((item) => (
    <li
      key={item}
      onClick={() => setActive(item)}
      className="cursor-pointer p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-amber-500"
    >
      {open && item}
    </li>
))}

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

    {basket && basket.items?.length > 0 ? (
      basket.items.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded shadow mb-3 flex justify-between"
        >
          <div>
            🍔 {item.foodId?.name || "Food"} 
          </div>

          <div>
            Qty: {item.quantity}
          </div>
        </div>
      ))
    ) : (
      <p>No items in basket</p>
    )}

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

        {/* ADMIN DASHBOARD */}
       {user?.role === "ADMIN" && active === "dashboard" && (
        <div>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

       <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          👤 Users
        </div>

       <div className="bg-white p-6 rounded shadow">
        🍔 Food Partners
       </div>

      <div className="bg-white p-6 rounded shadow">
        📦 Orders
      </div>
       </div>
     </div>
     )}
  
      {user?.role === "ADMIN" && active === "users" && (
  <div>
    <h1 className="text-2xl font-bold mb-4">All Users</h1>

    <div className="bg-white p-4 rounded shadow">
      <p>Loading users...</p>
    </div>
  </div>
)}

{user?.role === "ADMIN" && active === "partners" && (
  <div>
    <h1 className="text-2xl font-bold mb-4">Food Partners</h1>

    <div className="bg-white p-4 rounded shadow">
      <p>Pending / Approved / Rejected partners will show here...</p>
    </div>
  </div>
)}


      </main>
    </div>
  );
};

export default Dashboard;