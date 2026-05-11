import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Checkout from "./Checkout";

interface BasketItem {
  _id: string;
  foodId: {
    _id: string;
    name: string;
    price: number;
    image?: { url: string };
  };
  quantity: number;
}

interface BasketResponse {
  success: boolean;
  basket: {
    items: BasketItem[];
  };
}

const Basket = () => {
  const navigate = useNavigate();
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  useEffect(() => {
    fetchBasket();
  }, []);

  const fetchBasket = async (): Promise<void> => {
    try {
      const response = await axios.get<BasketResponse>(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { withCredentials: true }
      );
      setBasketItems(response.data.basket?.items || []);
    } catch (error) {
      console.error("Error fetching basket:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectItem = (itemId: string): void => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = (): void => {
    const allIds = new Set(basketItems.map(item => item._id));
    setSelectedItems(allIds);
  };

  const deselectAllItems = (): void => {
    setSelectedItems(new Set());
  };

  const getSelectedItemsData = (): BasketItem[] => {
    return basketItems.filter(item => selectedItems.has(item._id));
  };

  const getSelectedSubtotal = (): number => {
    const selected = getSelectedItemsData();
    return selected.reduce((total, item) => {
      return total + ((item.foodId?.price || 0) * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div className="text-center py-8">Loading basket...</div>;
  }

  if (basketItems.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center text-gray-500">
        <p>Your basket is empty</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Basket</h1>

      {/* Selection Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={selectAllItems}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={deselectAllItems}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Deselect All
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Selected: {selectedItems.size} items
        </p>
      </div>

      {/* Basket Items */}
      <div className="space-y-3">
        {basketItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white p-4 rounded shadow flex justify-between items-center border-2 transition ${
              selectedItems.has(item._id) 
                ? "border-orange-500 bg-orange-50" 
                : "border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.has(item._id)}
                onChange={() => toggleSelectItem(item._id)}
                className="w-5 h-5 cursor-pointer accent-orange-500"
              />
              
              {item.foodId?.image?.url && (
                <img 
                  src={item.foodId.image.url} 
                  alt={item.foodId.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-semibold">{item.foodId?.name || "Food"}</p>
                <p className="text-sm text-gray-500">
                  ₨ {item.foodId?.price} x {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">
                ₨ {(item.foodId?.price || 0) * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Checkout Button */}
      <button 
        onClick={() => setShowCheckoutModal(true)}
        disabled={selectedItems.size === 0}
        className={`w-full px-6 py-3 rounded-lg mt-4 font-semibold transition ${
          selectedItems.size > 0
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Checkout Selected Items ({selectedItems.size})
      </button>

      {/* Checkout Modal */}
      <Checkout
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSuccess={() => {
          fetchBasket();
          setSelectedItems(new Set());
          setShowCheckoutModal(false);
        }}
        selectedItems={getSelectedItemsData()}
        subtotal={getSelectedSubtotal()}
      />
    </div>
  );
};

export default Basket;