import Nav from "./Nav";
// import tap1 from "../../assets/photo/Tab 1.png";
// import tap2 from "../../assets/photo/Tab 2.png";
// import ButtonOfSearch from "../../assets/photo/Button.png";
import headerPic from "../../assets/photo/header pic.png";

function Header() {
  return (
    <header>
      <Nav />

      <div className="bg-[#FACD2D] shadow-inner relative overflow-hidden px-4 md:px-10 lg:px-20 py-10">
        
        {/* TEXT SECTION */}
        <h1 className="text-white font-bold text-3xl md:text-5xl lg:text-[80px] mt-6 md:mt-10">
          Are you starving?
        </h1>

        <p className="text-base md:text-lg lg:text-[21px] text-gray-600 mt-2">
          Within a few clicks, find meals that are accessible near you
        </p>

        {/* IMAGE */}
        <img
          src={headerPic}
          className="hidden md:block w-60 lg:w-110 absolute top-10 right-5 lg:right-20"
          alt=""
        />
      </div>
    </header>
  );
}

export default Header;
