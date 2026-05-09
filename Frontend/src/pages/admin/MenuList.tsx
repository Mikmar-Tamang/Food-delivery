// frontend/src/components/partner/MyMenuList.tsx
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

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
  message: string;
  discounts: Discount[];
}

interface FoodsResponse {
  success?: boolean;
  food: FoodItem[];
}

interface AddDiscountResponse {
  success: boolean;
  message: string;
  discount: Discount;
}

interface ErrorResponseData {
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
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    await Promise.all([fetchMyFoods(), fetchMyDiscounts()]);
    setLoading(false);
  };

  const fetchMyFoods = async (): Promise<void> => {
    try {
      const response = await axios.get<FoodsResponse>(
        `${import.meta.env.VITE_API_URL}/api/food/my-foods`,
        { withCredentials: true }
      );
      setFoods(response.data.food || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  const fetchMyDiscounts = async (): Promise<void> => {
    try {
      const response = await axios.get<DiscountsResponse>(
        `${import.meta.env.VITE_API_URL}/api/food-discount/my-discounts`,
        { withCredentials: true }
      );
      
      const discountsArray = response.data.discounts || [];
      const discountsMap: { [key: string]: Discount } = {};
      
      discountsArray.forEach((discount: Discount) => {
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
      await fetchMyDiscounts();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponseData>;
      const errorMessage = axiosError.response?.data?.message || "Failed to add discount";
      alert(errorMessage);
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
      await fetchMyDiscounts();
      setSelectedFood(null);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponseData>;
      const errorMessage = axiosError.response?.data?.message || "Failed to remove discount";
      alert(errorMessage);
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
          
          return (
            <div
              key={food._id}
              onClick={() => setSelectedFood(food)}
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="w-full h-48 overflow-hidden bg-gray-100">
                <img
                  src={food.image.url}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg line-clamp-1">{food.name}</h3>
                  {discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap ml-2">
                      {discount.discount}% OFF
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{food.description}</p>
                
                <div className="mt-2">
                  {discount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold text-lg">
                        ₨ {calculateDiscountedPrice(food.price, discount.discount)}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        ₨ {food.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-bold text-lg">₨ {food.price}</span>
                  )}
                </div>
                
                {discount && discount.discountTime && (
                  <p className="text-xs text-orange-500 mt-1">
                    ⏱️ {discount.discountTime}
                  </p>
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
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
                <p className="text-sm text-gray-600">Discounted Price</p>
                <p className="text-2xl font-bold text-green-600">
                  ₨ {calculateDiscountedPrice(selectedFood.price, discounts[selectedFood._id].discount)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  Original: ₨ {selectedFood.price}
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  ⏱️ {discounts[selectedFood._id].discountTime}
                </p>
                <button
                  onClick={() => handleRemoveDiscount(discounts[selectedFood._id]._id)}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Remove Discount
                </button>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="mb-2">Current Price: <strong>₨ {selectedFood.price}</strong></p>
                
                <label className="block text-sm text-gray-600 mb-1">Discount %</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="e.g., 20"
                  className="w-full p-2 border rounded mb-2"
                />
                
                <label className="block text-sm text-gray-600 mb-1">Offer Name (Optional)</label>
                <input
                  type="text"
                  value={discountTime}
                  onChange={(e) => setDiscountTime(e.target.value)}
                  placeholder="Weekend Special, Happy Hour, etc."
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyMenuList;