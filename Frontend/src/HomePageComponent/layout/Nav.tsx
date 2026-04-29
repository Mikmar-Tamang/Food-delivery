
import logo from "../../assets/photo/Logo.png";
import user from "../../assets/photo/user.png";
import locationLogo from "../../assets/photo/map-marker-alt.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Nav() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/auth/user/me",
          { withCredentials: true }
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
    navigation("/admin");
  };

  return (
    <div className="bg-white flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-3 gap-3">

      {/* LOGO */}
      <img src={logo} alt="logo" className="w-40 md:w-60" />

      {/* LOCATION */}
      <div className="flex items-center gap-2 text-sm md:text-base text-center md:text-left">
        <p className="font-bold">Deliver to:</p>
        <img src={locationLogo} className="w-4 h-4" />
        <p>
          Current Location <b>Swoyambhu, Kathmandu</b>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col md:flex-row items-center gap-3">

        {/* SEARCH */}
        <input
          type="text"
          className="text-black rounded-md w-40 md:w-52 px-3 h-8 font-bold bg-gray-100"
          placeholder="Search Food"
        />

        {loading ? (
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md" />
        ) : loggedIn ? (
          <button
            onClick={handleDashboard}
            className="bg-yellow-400 text-black px-4 py-1 rounded-md font-bold"
          >
            Dashboard
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigation("/login")}
              className="flex items-center gap-1 px-3 py-1 rounded-md shadow-md text-yellow-500 font-bold"
            >
              <img src={user} className="w-4 h-4" />
              Login
            </button>

            <button
              onClick={() => navigation("/register")}
              className="px-3 py-1 rounded-md shadow-md text-green-500 font-bold"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;