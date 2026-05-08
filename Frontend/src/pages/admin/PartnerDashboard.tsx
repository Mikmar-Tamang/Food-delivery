// frontend/src/pages/partner/PartnerDashboard.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Types
interface FoodPartner {
  _id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isBanned: boolean;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<FoodPartner | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });

  useEffect(() => {
    fetchPartnerProfile();
    fetchStats();
  }, []);

  const fetchPartnerProfile = async () => {
    try {
      const response = await axios.get<{ success: boolean; foodPartner: FoodPartner }>(
        `${import.meta.env.VITE_API_URL}/api/food-partner/profile`,
        { withCredentials: true }
      );
      setPartner(response.data.foodPartner);
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/food-partner-login");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get<{ success: boolean; stats: DashboardStats }>(
        `${import.meta.env.VITE_API_URL}/api/food-partner/stats`,
        { withCredentials: true }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`,
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-green-600">{partner.restaurantName}</h2>
          <p className="text-sm text-gray-600">Welcome, {partner.name}</p>
          <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
            partner.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {partner.status}
          </span>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left p-2 mb-2 rounded transition ${
              activeTab === "dashboard" ? "bg-green-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-2 mb-2 rounded transition ${
              activeTab === "orders" ? "bg-green-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            🍽️ Orders
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`w-full text-left p-2 mb-2 rounded transition ${
              activeTab === "menu" ? "bg-green-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            📝 My Menu
          </button>
          <button
            onClick={() => setActiveTab("add-food")}
            className={`w-full text-left p-2 mb-2 rounded transition ${
              activeTab === "add-food" ? "bg-green-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            ➕ Add Food Item
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded transition"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Today's Orders</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.todayOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Completed Orders</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₨ {stats.totalRevenue}</p>
              </div>
            </div>

            {/* Status Banner for Pending Approval */}
            {partner.status === "PENDING" && (
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your account is pending approval from admin. You'll get full access once approved.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-center py-8">
                Order management will appear here once you create the order system.
              </p>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">My Menu Items</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-center py-8">
                Your food items will appear here.
              </p>
            </div>
          </div>
        )}

        {activeTab === "add-food" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Add New Food Item</h1>
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <p className="text-gray-600 text-center py-8">
                Food item form will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;