// frontend/src/components/CheckoutModal.tsx
import { useState } from "react";
import axios, { AxiosError } from "axios";

interface SelectedItem {
  _id: string;
  foodId: {
    _id: string;
    name: string;
    price: number;
    image?: { url: string };
  };
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItems: SelectedItem[];  // Changed from basketItems
  subtotal: number;
}

interface DeliveryDetails {
  street: string;
  city: string;
  area: string;
  landmark: string;
  phone: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  order: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
  };
}

interface ErrorResponse {
  message?: string;
}

const Checkout = ({ isOpen, onClose, onSuccess, selectedItems, subtotal }: CheckoutModalProps) => {
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    street: "",
    city: "",
    area: "",
    landmark: "",
    phone: ""
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!deliveryDetails.street || !deliveryDetails.city || !deliveryDetails.area || !deliveryDetails.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }

    setSubmitting(true);
    
    try {
      // Send selected items to backend
      const response = await axios.post<OrderResponse>(
        `${import.meta.env.VITE_API_URL}/api/orders/checkout`,
        { 
          deliveryDetails,
          selectedItems: selectedItems.map(item => ({
            foodId: item.foodId._id,
            quantity: item.quantity
          }))
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert(`✅ Order placed successfully!\nOrder #: ${response.data.order.orderNumber}\nTotal: ₨ ${response.data.order.totalAmount}`);
        onSuccess();
        onClose();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Checkout ({selectedItems.length} items)</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Delivery Form */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Delivery Details</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryDetails.street}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={deliveryDetails.area}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Thamel"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Kathmandu"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={deliveryDetails.landmark}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Near Temple"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="9823869631"
                  />
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Selected Items</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.foodId?.name} x {item.quantity}
                      </span>
                      <span>₨ {(item.foodId?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₨ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₨ {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-orange-600">₨ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  💰 <strong>Cash on Delivery</strong> - Pay when you receive your order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {submitting ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;