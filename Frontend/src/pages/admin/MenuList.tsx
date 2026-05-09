// frontend/src/components/partner/MyMenuList.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: { url: string };
  foodPartner: string;
}

interface Discount {
  _id: string;
  discount: string;
  discountTime: string;
  food: string;
}

interface DiscountsResponse {
  success: boolean;
  discounts: Discount[];
}

interface FoodResponse {
  food: FoodItem[];
}

interface AddDiscountResponse {
  success: boolean;
  message: string;
  discount: Discount;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const MyMenuList = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [discounts, setDiscounts] = useState<{ [key: string]: Discount }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [discountTime, setDiscountTime] = useState<string>("");
  const [addingDiscount, setAddingDiscount] = useState<boolean>(false);

  useEffect(() => {
    fetchMyFoods();
    fetchMyDiscounts();
  }, []);

  const fetchMyFoods = async (): Promise<void> => {
    try {
      const response = await axios.get<FoodResponse>(
        `${import.meta.env.VITE_API_URL}/api/food/my-foods`,
        { withCredentials: true }
      );
      setFoods(response.data.food);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDiscounts = async (): Promise<void> => {
    try {
      const response = await axios.get<DiscountsResponse>(
        `${import.meta.env.VITE_API_URL}/api/food-discount/my-discounts`,
        { withCredentials: true }
      );
      const discountsMap: { [key: string]: Discount } = {};
      response.data.discounts.forEach((discount: Discount) => {
        discountsMap[discount.food] = discount;
      });
      setDiscounts(discountsMap);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const calculateDiscountedPrice = (originalPrice: number, discountPercent: string): string => {
    const discount = parseFloat(discountPercent);
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    return discountedPrice.toFixed(2);
  };

  const handleAddDiscount = async (): Promise<void> => {
    if (!selectedFood) return;
    
    const discountNum = parseFloat(discountAmount);
    if (isNaN(discountNum) || discountNum <= 0) {
      alert("Please enter valid discount amount");
      return;
    }
    if (discountNum > 100) {
      alert("Discount cannot exceed 100%");
      return;
    }

    setAddingDiscount(true);
    try {
      await axios.post<AddDiscountResponse>(
        `${import.meta.env.VITE_API_URL}/api/food-discount/discount`,
        {
          foodId: selectedFood._id,
          discount: discountAmount,
          discountTime: discountTime || "Limited Time"
        },
        { withCredentials: true }
      );
      
      alert("Discount added successfully!");
      setSelectedFood(null);
      setDiscountAmount("");
      setDiscountTime("");
      fetchMyDiscounts();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      alert(err.response?.data?.message || "Failed to add discount");
    } finally {
      setAddingDiscount(false);
    }
  };

  const handleRemoveDiscount = async (discountId: string): Promise<void> => {
    if (!confirm("Are you sure you want to remove this discount?")) return;
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/food-discount/discount/${discountId}`,
        { withCredentials: true }
      );
      
      alert("Discount removed successfully!");
      fetchMyDiscounts();
      setSelectedFood(null);
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      alert(err.response?.data?.message || "Failed to remove discount");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your menu...</div>;
  }

  if (foods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No food items added yet. Use "Add Food Item" tab to create your first item!
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => {
          const discount = discounts[food._id];
          const discountedPrice = discount ? calculateDiscountedPrice(food.price, discount.discount) : null;
          
          return (
            <div
              key={food._id}
              onClick={() => setSelectedFood(food)}
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={food.image.url}
                alt={food.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{food.name}</h3>
                  {discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {discount.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{food.description}</p>
                <div className="mt-2">
                  {discount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">₨ {discountedPrice}</span>
                      <span className="text-gray-400 line-through text-sm">₨ {food.price}</span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-bold">₨ {food.price}</span>
                  )}
                </div>
                {discount && discount.discountTime && (
                  <p className="text-xs text-orange-500 mt-1">⏱️ {discount.discountTime}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Food Item Popup Modal */}
      {selectedFood && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedFood(null)}
            >
              ✖
            </button>

            <img
              src={selectedFood.image.url}
              alt={selectedFood.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <h2 className="text-2xl font-bold">{selectedFood.name}</h2>
            <p className="text-gray-600 mt-2">{selectedFood.description}</p>

            {discounts[selectedFood._id] ? (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Discounted Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₨ {calculateDiscountedPrice(selectedFood.price, discounts[selectedFood._id].discount)}
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      Original: ₨ {selectedFood.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {discounts[selectedFood._id].discount}% OFF
                    </span>
                    {discounts[selectedFood._id].discountTime && (
                      <p className="text-xs text-orange-500 mt-1">
                        ⏱️ {discounts[selectedFood._id].discountTime}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDiscount(discounts[selectedFood._id]._id)}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                >
                  Remove Discount
                </button>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">Current Price: <strong>₨ {selectedFood.price}</strong></p>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full p-2 border rounded mb-2"
                    min="0"
                    max="100"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Time / Offer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={discountTime}
                    onChange={(e) => setDiscountTime(e.target.value)}
                    placeholder="e.g., Happy Hour, Weekend Special"
                    className="w-full p-2 border rounded mb-3"
                  />
                  
                  <button
                    onClick={handleAddDiscount}
                    disabled={addingDiscount}
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {addingDiscount ? "Adding..." : "Add Discount"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyMenuList;