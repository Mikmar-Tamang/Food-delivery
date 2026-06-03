// frontend/src/pages/SearchResults.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./homePage/sections/Nav";
import Footer from "./homePage/sections/Footer";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: { url: string };
  foodPartner?: {
    restaurantName: string;
  };
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchFoods();
    }
  }, [query]);

  const searchFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/food/search?q=${query}`
      );
      setFoods(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          Results for "{query}"
        </h1>
        <p className="text-gray-600 mb-6">
          Found {foods.length} {foods.length === 1 ? "item" : "items"}
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No results found for "{query}"</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Browse All Foods
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                onClick={() => navigate(`/food/${food._id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={food.image?.url}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{food.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {food.foodPartner?.restaurantName}
                  </p>
                  <p className="text-orange-500 font-bold mt-2">₨ {food.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;