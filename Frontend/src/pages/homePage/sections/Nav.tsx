
import logo from "../../../assets/photo/Logo.png";
import user from "../../../assets/photo/user.png";
import locationLogo from "../../../assets/photo/map-marker-alt.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Nav() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const location = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/auth/user/me",
          { withCredentials: true },
        );

        setLoggedIn(!!res.data.user);
      } catch {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  const handleDashboard = () => {
    navigation("/dashboard");
  };

  // ✅ Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  // ✅ Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="bg-white lg:ml-28 flex flex-col md:flex-row px-4 lg:gap-36 md:px-10 py-3 gap-3">

    {/* LOCATION */}
      <div className=" md:hidden lg:hidden flex items-center justify-center gap-2 text-[12px] text-center">
        <p className="font-bold">Deliver to:</p>
        <img src={locationLogo} className="w-4 h-4" />
        <p>
          Current Location <b>Swoyambhu, Kathmandu</b>
        </p>
      </div> 
      {/* LOGO - Make it clickable to go home */}
      <div className="flex items-center lg:gap-22 justify-between">
      <img
        src={logo}
        alt="logo"
        className="w-52 md:w-64 cursor-pointer"
        onClick={() => navigation("/")}
      />
      
      {/* LOCATION */}
      <div className=" hidden md:flex lg:flex items-center gap-2 text-[12px] md:text-base text-center md:text-left">
        <p className="font-bold">Deliver to:</p>
        <img src={locationLogo} className="w-4 h-4" />
        <p>
          Current Location <b>Swoyambhu, Kathmandu</b>
        </p>
      </div> 

      {/* RIGHT SIDE */}
      <div className=" hidden md:flex lg:flex md:flex-row justify-center items-center gap-3">
        {/* ✅ SEARCH with form submission */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-black rounded-l-md w-40 md:w-52 px-3 h-8 font-bold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Search Food..."
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-3 h-8 rounded-r-md font-bold hover:bg-yellow-500 transition"
          >
            🔍
          </button>
        </form>
      </div>

       {loading ? (
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md" />
        ) : loggedIn ? (
          <button
            onClick={handleDashboard}
            className="bg-yellow-400 text-black px-4 py-1 lg:text-[16px] text-[12px] md:text-[14px] rounded-md font-bold"
          >
            Dashboard
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigation("/login")}
              className="flex items-center gap-1 px-3 rounded-md shadow-md text-yellow-500 font-bold"
            >
              <img src={user} className="w-3 lg:w-4 h-3 lg:h-4" />
              <p className="text-[12px] lg:text-[16px] md:text-[14px]">Login</p>
            </button>

            <button
              onClick={() => navigation("/user-register")}
              className="px-3 py-1 rounded-md text-[12px] lg:text-[16px] md:text-[14px] shadow-md text-green-500 font-bold"
            >
              Register
            </button>
          </div>
        )}
        </div>

     

      {/* RIGHT SIDE */}
      <div className=" md:hidden lg:hidden flex md:flex-row justify-center items-center gap-3">
        {/* ✅ SEARCH with form submission */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-black rounded-l-md w-40 md:w-52 px-3 h-8 font-bold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Search Food..."
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-3 h-8 rounded-r-md font-bold hover:bg-yellow-500 transition"
          >
            🔍
          </button>
        </form>
      </div>

       
    </div>
  );
}

export default Nav;
