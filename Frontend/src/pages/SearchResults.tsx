// frontend/src/pages/SearchResults.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./homePage/sections/Nav";
import Footer from "./homePage/sections/Footer";
import { addToCart } from "../../src/services/cart.service";
import { FoodType } from "../../src/types/food";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [qty, setQty] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user/me`,
          { withCredentials: true }
        );
        setIsLoggedIn(!!response.data.user);
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Auth check failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Search foods when query changes
  useEffect(() => {
    if (query) {
      searchFoods();
    }
  }, [query]);

  // Reset quantity when selected food changes
  useEffect(() => {
    if (selectedFood) {
      setQty(1);
    }
  }, [selectedFood]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedFood) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFood]);

  const searchFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/food/search?q=${query}`
      );
      setFoods(response.data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedFood ? Number(selectedFood.price) * qty : 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      const userChoice = confirm("Please login to add items to basket.\n\nClick OK to go to login page.");
      if (userChoice) {
        navigate("/login");
      }
      return;
    }

    if (!selectedFood) return;

    try {
      setCartLoading(true);
      await addToCart(selectedFood._id, qty);
      alert("✓ Item added to basket!");
      setSelectedFood(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          setIsLoggedIn(false);
          navigate("/login");
        } else {
          alert("Failed to add to basket. Please try again.");
        }
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setCartLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav />
      
      <main className="grow container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-1">
            Found {foods.length} {foods.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && foods.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No results found for "{query}"</p>
            <p className="text-gray-400 mt-2">Try searching for something else</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Browse All Foods
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={food.image?.url || "/placeholder-food.jpg"}
                    alt={food.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {food.name}
                  </h3>
                  
                  {food.foodPartner && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {food.foodPartner.restaurantName}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {food.description || "Delicious food item"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-500">
                      ₨ {food.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFood(food);
                      }}
                      className="px-3 py-1 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition text-sm font-bold"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Food Modal - Same as your Main component */}
      {selectedFood && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-96 relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl hover:text-gray-700"
              onClick={() => setSelectedFood(null)}
            >
              ✖
            </button>

            <img
              src={selectedFood.image?.url}
              className="w-full h-40 object-cover rounded-lg mb-4"
              alt={selectedFood.name}
            />

            <h2 className="text-xl font-bold">{selectedFood.name}</h2>
            <p className="text-gray-600 mt-1 text-sm">
              {selectedFood.description || "Delicious food item"}
            </p>
            
            {selectedFood.foodPartner && (
              <p className="text-gray-500 text-sm mt-1">
                {selectedFood.foodPartner.restaurantName}
              </p>
            )}
            
            <p className="text-2xl font-bold text-orange-500 mt-2">
              Rs {totalPrice.toFixed(2)}
            </p>

            <div className="flex items-center gap-4 my-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                -
              </button>
              <span className="font-semibold text-lg">{qty}</span>
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isLoggedIn
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {cartLoading ? "Adding..." : (isLoggedIn ? "Add to Basket" : "Login to Order")}
            </button>

            {!isLoggedIn && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Please login to add items to your basket
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;