import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Basket } from "../../types/baseket";
import { User, Partner } from "../../types/user.ts";
import { getAllUsers, banUser, getAllPartners, banPartner, approvePartner, rejectPartner} from "../../services/admin.service.ts";

const Dashboard = () => {

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);


  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("profile");


  const [basket, setBasket] = useState<Basket | null>(null);

  const navigate = useNavigate();



  useEffect(() => {
  const fetchPartners = async () => {
    try {
      const res = await getAllPartners();
      setPartners(res);
    } catch (err) {
      console.log(err);
    }
  };

  if (user?.role === "ADMIN" && active === "partners") {
    fetchPartners();
  }
}, [active, user]);

const handleBanPartner = async (id: string) => {
  try {
    await banPartner(id);
    const res = await getAllPartners();
    setPartners(res);
  } catch (err) {
    console.log(err);
  }
};

const handleApprovePartner = async (id: string) => {
  try {
    await approvePartner(id);
    const res = await getAllPartners();
    setPartners(res);
  } catch (err) {
    console.log(err);
  }
};

const handleRejectPartner = async (id: string) => {
  try {
    await rejectPartner(id);

    const updated = await getAllPartners();
    setPartners(updated);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (user?.role === "ADMIN" && active === "users") {
    fetchUsers();
  }
}, [active, user]);

const handleBan = async (id: string) => {
  try {
    await banUser(id);
    
    // refresh list after ban
    const data = await getAllUsers();
    setUsers(data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/auth/user/me",
        { withCredentials: true }
      );

      setUser(res.data.user);

    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
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
        loading ? (
          <p>Loading users...</p>
        ) : (
  <div>
    <h1 className="text-2xl font-bold mb-4">All Users</h1>

   <div className="bg-white p-4 rounded shadow">
  {users.map((u) => (
    <div key={u._id} className="flex justify-between border-b py-2">
      <div>
        <p>{u.username}</p>
        <p className="text-sm text-gray-500">{u.email}</p>
      </div>

      <button
        onClick={() => handleBan(u._id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        {u.isBanned ? "Banned" : "Ban"}
      </button>
    </div>
  ))}
</div>
  </div>
) 
)}

{user?.role === "ADMIN" && active === "partners" && (
  loading ? (
    <p>Loading partners...</p>
  ) : (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Partners</h1>

      <div className="bg-white p-4 rounded shadow">
        {partners.map((p) => (
          <div key={p._id} className="border-b py-3 flex justify-between">

            <div>
              <p className="font-bold">{p.restaurantName}</p>
              <p className="text-sm text-gray-500">
                Owner: {p.name}
              </p>
              <p className="text-sm">
                Status: {p.status}
              </p>
            </div>

            <div className="flex gap-2">

              <button
   onClick={() => setSelectedPartner(p)}
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  View Details
</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
)}
{selectedPartner && (
  <div className="bg-white mt-6 p-6 rounded shadow">
    
    <h2 className="text-xl font-bold mb-4">
      Partner Details
    </h2>

    <p>
      <strong>Restaurant:</strong>
      {" "}
      {selectedPartner.restaurantName}
    </p>

    <p>
      <strong>Owner:</strong>
      {" "}
      {selectedPartner.name}
    </p>

    <p>
      <strong>Email:</strong>
      {" "}
      {selectedPartner.email}
    </p>

    <p>
      <strong>Status:</strong>
      {" "}
      {selectedPartner.status}
    </p>

    <p>
      <strong>Banned:</strong>
      {" "}
      {selectedPartner.isBanned ? "Yes" : "No"}
    </p>

    <div className="flex gap-3 mt-4">

      <button
        onClick={() => handleApprovePartner(selectedPartner._id)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => handleRejectPartner(selectedPartner._id)}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Reject
      </button>

      <button
        onClick={() => handleBanPartner(selectedPartner._id)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Ban
      </button>

      <button
  onClick={() => setSelectedPartner(null)}
  className="bg-gray-500 text-white px-3 py-1 rounded mb-4"
>
  Close
</button>

    </div>
  </div>
)}


      </main>
    </div>
  );
};

export default Dashboard;