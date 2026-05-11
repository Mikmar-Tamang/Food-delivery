import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
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
  deliveredAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

const UserOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async (): Promise<void> => {
    try {
      const response = await axios.get<OrdersResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/user/orders`,
        { withCredentials: true }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string): string => {
    const icons: { [key: string]: string } = {
      pending: "⏳",
      accepted: "✅",
      ready: "🍽️",
      delivered: "🚚",
      rejected: "❌"
    };
    return icons[status] || "📦";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            {/* Order Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="font-semibold text-gray-700">
                  Order #{order.orderNumber}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {item.name} x{item.quantity}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    📍 {order.deliveryAddress.area}, {order.deliveryAddress.city}
                  </p>
                </div>
                <p className="font-bold text-orange-600 text-lg">
                  ₨ {order.totalAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold">{selectedOrder.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Placed on: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              {/* Order Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedOrder.status !== 'rejected' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  
                  {selectedOrder.status !== 'rejected' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${['accepted', 'ready', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className="font-medium">Order Accepted</p>
                          <p className="text-xs text-gray-500">Restaurant has accepted your order</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${['ready', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className="font-medium">Ready for Delivery</p>
                          <p className="text-xs text-gray-500">Your food is ready and waiting for pickup</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${selectedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-xs text-gray-500">Order has been delivered to you</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedOrder.status === 'rejected' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium text-red-600">Order Rejected</p>
                        <p className="text-xs text-gray-500">Reason: {selectedOrder.rejectionReason || "No reason provided"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p className="text-sm">{selectedOrder.deliveryAddress.street}</p>
                <p className="text-sm">{selectedOrder.deliveryAddress.area}, {selectedOrder.deliveryAddress.city}</p>
                {selectedOrder.deliveryAddress.landmark && (
                  <p className="text-sm text-gray-500">Landmark: {selectedOrder.deliveryAddress.landmark}</p>
                )}
                <p className="text-sm mt-1">📞 {selectedOrder.deliveryAddress.phone}</p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₨ {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₨ {selectedOrder.totalAmount - 50}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₨ 50</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">₨ {selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;