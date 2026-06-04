import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: {
    street: string;
    city: string;
    area: string;
    landmark: string;
    phone: string;
  };
  createdAt: string;
  rejectionReason?: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

interface ActionResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  message?: string;
}

const PartnerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async (): Promise<void> => {
    setLoading(true);
    try {
      const url = statusFilter === "all" 
        ? `${import.meta.env.VITE_API_URL}/api/orders/partner/orders`
        : `${import.meta.env.VITE_API_URL}/api/orders/partner/orders?status=${statusFilter}`;
      
      const response = await axios.get<OrdersResponse>(url, {
        withCredentials: true
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId: string): Promise<void> => {
    try {
      const response = await axios.patch<ActionResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/partner/orders/${orderId}/accept`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert("Order accepted!");
        fetchOrders();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.message || "Failed to accept order");
    }
  };

  const handleReady = async (orderId: string): Promise<void> => {
    try {
      const response = await axios.patch<ActionResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/partner/orders/${orderId}/ready`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert("Order marked as ready!");
        fetchOrders();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.message || "Failed to mark as ready");
    }
  };

  const handleDelivered = async (orderId: string): Promise<void> => {
    try {
      const response = await axios.patch<ActionResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/partner/orders/${orderId}/delivered`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert("Order marked as delivered!");
        fetchOrders();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.message || "Failed to mark as delivered");
    }
  };

  const handleReject = async (orderId: string): Promise<void> => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    try {
      const response = await axios.patch<ActionResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/partner/orders/${orderId}/reject`,
        { reason: rejectionReason },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert("Order rejected!");
        setShowRejectModal(false);
        setRejectionReason("");
        fetchOrders();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.message || "Failed to reject order");
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      ready: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusButtons = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleAccept(order._id)}
              className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowRejectModal(true);
              }}
              className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        );
      case "accepted":
        return (
          <button
            onClick={() => handleReady(order._id)}
            className="w-full bg-purple-500 text-white px-3 py-1 rounded text-sm mt-3 hover:bg-purple-600"
          >
            Mark Ready
          </button>
        );
      case "ready":
        return (
          <button
            onClick={() => handleDelivered(order._id)}
            className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm mt-3 hover:bg-blue-600"
          >
            Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "accepted", "ready", "delivered", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded capitalize ${
                statusFilter === status
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <p className="font-semibold">{order.user.name}</p>
                  <p className="text-sm text-gray-600">📞 {order.user.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {order.deliveryAddress.area}, {order.deliveryAddress.city}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">₨ {order.totalAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {getStatusButtons(order)}
                </div>
              </div>
              
              {/* Order Items Preview */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-1">Items:</p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              
              {order.rejectionReason && (
                <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-600">
                  Rejection reason: {order.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Order</h3>
            <p className="text-gray-600 mb-2">
              Order #{selectedOrder.orderNumber}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full p-2 border rounded mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedOrder._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnerOrders;