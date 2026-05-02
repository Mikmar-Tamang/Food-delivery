import flashDeal from "../../assets/photo/Flash Deal Card.png";
import flashDeal1 from "../../assets/photo/Flash Deal Card (1).png";
import flashDeal2 from "../../assets/photo/Flash Deal Card (2).png";
import flashDeal3 from "../../assets/photo/Flash Deal Card (3).png";
import step1 from "../../assets/photo/Frame 730.png";
import step2 from "../../assets/photo/Frame 731.png";
import step3 from "../../assets/photo/Frame 732.png";
import step4 from "../../assets/photo/Frame 733.png";
import locationLogo from "../../assets/photo/map-marker-alt.png";
import leftArrow from "../../assets/photo/Arrow Left.png";
import rightArrow from "../../assets/photo/Arrow Right.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { FoodType } from "../../types/food";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FoodDiscountType } from "../../types/foodDiscount";
import { addToCart } from "../../api/cart";


function Main() {
  const [food, setFood] = useState<FoodType[]>([]);
  const [foodDiscount, setFoodDiscount] = useState<FoodDiscountType[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/food",
          { withCredentials: true }
        );

        const res1 = await axios.get(
          import.meta.env.VITE_API_URL + "/api/food-discount/discount",
          { withCredentials: true }
        );

        setFoodDiscount(res1.data.viewFoodDiscount || []);
        setFood(res.data.food || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFood();
  }, []);

  useEffect(() => {
  if (selectedFood) {
    setQty(1);
  }
}, [selectedFood]);

useEffect(() => {
  if (selectedFood) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  // cleanup (important safety)
  return () => {
    document.body.style.overflow = "auto";
  };
}, [selectedFood]);

const totalPrice = selectedFood ? Number(selectedFood.price) * qty : 0;

  return (
    <main className="flex flex-col gap-10">

      {/* ================= PART 1 FLASH DEALS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6 lg:px-10">
        <img className="w-full" src={flashDeal} alt="" />
        <img className="w-full" src={flashDeal1} alt="" />
        <img className="w-full" src={flashDeal2} alt="" />
        <img className="w-full" src={flashDeal3} alt="" />
      </div>

      {/* ================= PART 2 HOW IT WORKS ================= */}
      <div className="flex flex-col items-center gap-6 px-4 md:px-6 lg:px-10 py-8 md:py-12 bg-linear-to-t from-[#FDEDCA] to-[#fcefd3]">
        <h1 className="text-[#F17228] text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          How does it work
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <img src={step1} className="w-full" alt="" />
          <img src={step2} className="w-full" alt="" />
          <img src={step3} className="w-full" alt="" />
          <img src={step4} className="w-full" alt="" />
        </div>
      </div>

      {/* ================= PART 3 POPULAR ITEMS ================= */}
      <div className="flex flex-col items-center gap-8 px-4 md:px-6 lg:px-10">
        <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl text-center">
          Popular items
        </h1>

        <div className="relative w-full flex items-center">

          {/* LEFT BUTTON */}
          <div className="prev-btn1 hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <img src={leftArrow} className="w-12 md:w-16" alt="prev" />
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            navigation={{
              prevEl: ".prev-btn1",
              nextEl: ".next-btn1",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full"
          >
            {food.map((item) => (
              <SwiperSlide key={item._id}>
                <div onClick={() => setSelectedFood(item)} className="bg-white rounded-2xl p-3 shadow-md">
                  <img
                    src={item.image?.url}
                    className="w-full rounded-2xl"
                    alt={item.name}
                  />
                  <p className="font-bold text-lg md:text-xl mt-2">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-2">
                    <img src={locationLogo} className="w-3 h-3" alt="" />
                    <p className="text-[#FFB30E] text-sm">
                      {item.foodPartner?.restaurantAddress || "Nepal"}
                    </p>
                  </div>

                  <p className="font-bold mt-1">${item.price}</p>

                  <button onClick={(e) => { e.stopPropagation(); setSelectedFood(item);}} 
                  className="bg-[#F17228] rounded-lg text-white text-sm h-10 w-full mt-2">
                    Order Now
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* RIGHT BUTTON */}
          <div className="next-btn1 hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <img src={rightArrow} className="w-12 md:w-16" alt="next" />
          </div>
        </div>
        {selectedFood && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setSelectedFood(null)}
  >
    {/* Card */}
    <div
      className="bg-white rounded-xl p-6 w-87.5 relative"
      onClick={(e) => e.stopPropagation()} // ❗ prevents closing when clicking inside
    >
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-xl"
        onClick={() => setSelectedFood(null)}
      >
        ✖
      </button>

      {/* Image */}
      <img
        src={selectedFood.image?.url}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* Name */}
      <h2 className="text-xl font-bold">{selectedFood.name}</h2>

      {/* Price */}
      <p className="text-gray-600 mb-4">Rs {totalPrice.toFixed(2)}</p>

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-4">
        <button className="bg-gray-300 px-3" onClick={() => setQty(Math.max(1, qty - 1))}>
          -
        </button>
        <span>{qty}</span>
        <button className="bg-gray-300 px-3" onClick={() => setQty(qty + 1)}>
          +
        </button>
      </div>

      {/* Add to cart */}
      <button  onClick={async () => {
  try {
    setLoading(true);
    await addToCart(selectedFood._id, qty);
    setSelectedFood(null);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false); // ✅ ALWAYS runs
  }
  }} disabled={loading} className="bg-amber-500 text-white w-full py-2 rounded">
        {loading ? "Adding..." : "Add to Basket"}
      </button>
    </div>
  </div>
)}
      </div>

      {/* ================= PART 4 FEATURED RESTAURANTS ================= */}
      <div className="flex flex-col items-center gap-8 px-4 md:px-6 lg:px-10">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-center">
          Featured Restaurants
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

          {foodDiscount.map((disItem) => (
            <div
              key={disItem._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={disItem.food?.image?.url}
                  className="w-full h-52 md:h-64 object-cover"
                  alt=""
                />

                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
                    {disItem.discount}% off
                  </div>
                  <div className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-sm">
                    {disItem.discountTime} Fast
                  </div>
                </div>
              </div>

              <div className="p-3 flex items-center gap-3">
                <img
                  src={disItem.food?.foodPartner?.restaurantPp?.url}
                  className="w-12 h-12 rounded-lg object-cover"
                  alt=""
                />

                <div>
                  <p className="font-bold text-sm">
                    {disItem.food?.foodPartner?.restaurantName}
                  </p>
                  <p className="text-yellow-500 text-sm">⭐ 4.6</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="bg-[#FF9A0E] text-white font-bold px-6 py-2 rounded-lg">
          View All
        </button>
      </div>

      {/* ================= PART 5 SEARCH FOOD ================= */}
      <div className="bg-[#FEFAF1] px-4 md:px-6 lg:px-10 py-10">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-bold">
          <h1 className="text-xl md:text-2xl">Search By Food</h1>

          <div className="flex items-center gap-2">
            <button className="text-[#FFB30E]">View All</button>
            <button className="prev-btn">
              <img src={leftArrow} className="w-12 md:w-16" alt="" />
            </button>
            <button className="next-btn">
              <img src={rightArrow} className="w-12 md:w-16" alt="" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          autoplay={{ delay: 3000 }}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="w-full mt-6"
        >
          {food.length > 0 ? (
            food.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="flex flex-col items-center gap-2">
                  <img
                    className="rounded-full w-20 h-20 md:w-28 md:h-28 object-cover"
                    src={item.image?.url}
                    alt=""
                  />
                  <p className="text-sm">{item.name}</p>
                </div>
              </SwiperSlide>
            ))
          ) : (
              <div className="w-full flex justify-center items-center py-10">
                <p className="text-xl md:text-3xl text-center font-bold text-yellow-500">
                  Waiting For Food Items...
                </p>
              </div>
          )}
        </Swiper>
      </div>

    </main>
  );
}

export default Main;