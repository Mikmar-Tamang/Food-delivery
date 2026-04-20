  import flashDeal from "../../assets/photo/Flash Deal Card.png"
import flashDeal1 from "../../assets/photo/Flash Deal Card (1).png"
import flashDeal2 from "../../assets/photo/Flash Deal Card (2).png"
import flashDeal3 from "../../assets/photo/Flash Deal Card (3).png"
import step1 from "../../assets/photo/Frame 730.png"
import step2 from "../../assets/photo/Frame 731.png"
import step3 from "../../assets/photo/Frame 732.png"
import step4 from "../../assets/photo/Frame 733.png"
import locationLogo from "../../assets/photo/map-marker-alt.png"
import leftArrow from "../../assets/photo/Arrow Left.png"
import rightArrow from "../../assets/photo/Arrow Right.png"
import { useState, useEffect} from "react"
import axios from "axios"
import { FoodType } from "../../types/food"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import { FoodDiscountType } from "../../types/foodDiscount"
  

function Main() {

  const [food, setFood] = useState<FoodType[]>([]);
  const [foodDiscount, setFoodDiscount]= useState<FoodDiscountType[]>([]);

useEffect(() => {
  const fetchFood = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL+"/api/food", {
        withCredentials: true,
      });

      const res1= await axios.get(import.meta.env.VITE_API_URL+"/api/food/discount", {
        withCredentials: true,
      });
      
      setFoodDiscount(res1.data.viewFoodDiscount || [])
      setFood(res.data.food || []);
    } catch (err) {
      console.log(err);
    }
  };

  fetchFood();
}, []); 

  return (
    <div>
      <main className="flex flex-col gap-3">
        {/* part-1 */}
      <div className="flex gap-5 px-49.25">
        <img className="w-78.75" src={flashDeal} alt="" />
        <img className="w-78.75" src={flashDeal1} alt="" />
        <img className="w-78.75" src={flashDeal2} alt="" />
        <img className="w-78.75" src={flashDeal3} alt="" />
      </div>
      {/* part-2 */}
      <div className=" mt-6 flex-col px-49.25 gap-4 flex bg-linear-to-t from-[#FDEDCA] to-[#fcefd3] items-center  justify-center">
      <div>
       <h1 className="text-[#F17228] text-[50px] font-bold ">How does it work</h1>
      </div>
      <div className="flex gap-2">
        <img src={step1} className="w-75" alt="" />
        <img src={step2} className="w-75" alt="" />
        <img src={step3} className="w-75" alt="" />
        <img src={step4} className="w-75" alt="" />
      </div>
      </div>

      {/* part-3 */}

      <div className="flex flex-col items-center gap-10">
      {/* Section Title */}
      <h1 className="font-bold text-[50px]">Popular items</h1>

      {/* Swiper Section */}
      <div className=" relative flex items-center">

        <div className="prev-btn1 absolute -left-22.5 top-1/2 -translate-y-1/2 z-20">
        <img src={leftArrow} className="w-20 md:w-24" alt="Prev" />
        </div>
        <Swiper
          modules={[Navigation, Autoplay
          ]}  
          slidesPerView={4}
          autoplay={{ delay: 3000 }}
  navigation={{
    prevEl: '.prev-btn1',
    nextEl: '.next-btn1',
  }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="w-350"
        >
          {food.map((item) => (
            <SwiperSlide key={item._id}>
              <div className=" gap-2 bg-white rounded-2xl p-2 shadow-md">
                <img
                  src={item.image?.url}
                  className="w-full rounded-2xl"
                  alt={item.name}
                />
                <p className="font-bold text-3xl">{item.name}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={locationLogo}
                    className="w-2.75 h-3.75"
                    alt=""
                  />
                  <p className="text-[#FFB30E]">
                    {item.foodPartner?.restaurantAddress || "Nepal"}
                  </p>
                </div>
                <p className="font-bold">${item.price}</p>
                <button className="bg-[#F17228] rounded-lg text-white text-[15px] h-10 w-37.5 mt-2">
                  Order Now
                </button>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
     
         <div className="next-btn1 absolute -right-22.5 top-1/2 -translate-y-1/2 z-20">
         <img src={rightArrow} className="w-20 md:w-24" alt="Next" />
         </div>
      </div>
      </div>

      {/* part-4 */}

      <div className="flex items-center gap-10 flex-col">
       <h1 className="font-bold text-[35px]">Featured Restaurants</h1>
       <div className="grid grid-cols-4 gap-7">

       {/* card */}
    {foodDiscount.map((disItem)=> {
      return(
      <div key={disItem._id}>
        <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  {/* Image Section */}
  <div className="relative overflow-hidden rounded-2xl">
    <img
      src={disItem.food?.image?.url}
      className="w-full h-67.5 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    {/* Overlay Badges */}
    <div className="absolute top-3 left-3 flex gap-2">
      {/* Discount */}
      <div className="bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1">
       <p className="text-[16px] font-bold">{disItem.discount}% off</p> 
      </div>
      {/* Fast badge */}
      <div className="bg-yellow-400 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1">
        <p className="text-[16px] font-bold">{disItem.discountTime} Fast</p>
      </div>
    </div>
  </div>
  {/* Bottom Section */}
  <div className="p-3 flex items-center gap-3">
    {/* Logo */}
    <img
      src={disItem.food?.foodPartner?.restaurantPp?.url}
      
      className="w-14 h-14 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
      alt="logo"
    />
    {/* Info */}
    <div className="flex flex-col">
      {/* Name */}
      <h2 className="font-bold text-gray-800 text-sm transition-colors duration-300 group-hover:text-orange-500">
        <p className="text-[16px] font-bold">{disItem.food?.foodPartner?.restaurantName}</p>
      </h2>
      {/* Rating */}
      <div className="flex items-center gap-1 text-sm">
        <span className="text-yellow-500">⭐</span>
        <span className="text-gray-600 text-[16px] font-medium">
         4.6
        </span>
      </div>
    </div>
  </div>
</div>
      </div>
    )})}
    
    
      </div>
       <button className="bg-[#FF9A0E] text-white font-sans font-bold w-25 h-7.5 rounded-lg">View All</button>
      </div>
      {/* part-5 */}
      <div className="bg-[#FEFAF1] h-112.5 p-20">
        <div className="flex justify-between font-bold items-center ">
          <h1 className="text-[30px]">Search By Food</h1>
          <div className="flex">
            <button className="text-[#FFB30E] mb-5 text-[17px]">View All</button>
            <button className="prev-btn"><img src={leftArrow} className="w-25" alt="" /></button>
            <button className="next-btn"><img src={rightArrow} className="w-25" alt="" /></button>
          </div>
        </div>
        <div className="w-full">
          <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.prev-btn',
            nextEl: '.next-btn',
          }}
            autoplay={{ delay: 3000 }}
            slidesPerView={6}
            spaceBetween={5}
            className="w-full"
            >
           
           { food.length > 0 ? (
           food.map((item) => (
            <SwiperSlide key={item._id}>
             <div className=" flex flex-col items-center gap-2">
              <img 
               className="rounded-full w-44 h-44 object-cover"
               src={item.image?.url} 
               alt={item.name}
             />
              <p>{item.name}</p>
            </div>
          </SwiperSlide>))):(
            <SwiperSlide >
              <div className="w-400 h-75 flex justify-center items-center">
                <p className="font-bold text-5xl text-yellow-500">Waiting For Food Items...</p></div>
            </SwiperSlide>
          )}
          
          </Swiper>

        </div>
      </div>
      </main>
    </div>
  )
}

export default Main