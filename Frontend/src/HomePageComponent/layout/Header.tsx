// import Nav from "./Nav"
// import tap1 from "../../assets/photo/Tab 1.png"
// import tap2 from "../../assets/photo/Tab 2.png"
// import ButtonOfSearch from "../../assets/photo/Button.png"
// import headerPic from "../../assets/photo/header pic.png"

// function Header() {
//   return (
//     <header>
//         <Nav/>
//         <div className="bg-[#FACD2D] shadow-inner relative overflow-hidden px-49.25 shadow-yellow-600  h-107.5">
//        <h1 className="text-white font-bold text-[80px] mt-12.75 ">Are you starving?</h1>
//         <p className="text-[21px] font-sans text-gray-600">Within a few clicks, find meals that are accessible near you</p>
//         <br />
//         {/* address box */}
//         <div className="bg-white p-3.75 rounded-md w-190 h-37.75">
//          <button><img src={tap1} alt="" className="w-38.75" /></button>
//          <button><img src={tap2} alt="" className="w-38.75"/></button>
//          <div className="flex justify-center gap-3 mt-6 items-center">
//           <input type="text" className="w-full bg-[#F5F5F5] rounded-md pl-2 h-7.5 " placeholder="Enter Your Address" />
//           <button><img src={ButtonOfSearch} alt="" className="w-47.5"/></button>
//          </div>
//         </div>
//       {/* picture */}
//       <img src={headerPic} className="w-110.75 absolute top-27.5 right-46.75 " alt="" />
//         </div>
//     </header>
//   )
// }

// export default Header

import Nav from "./Nav";
import tap1 from "../../assets/photo/Tab 1.png";
import tap2 from "../../assets/photo/Tab 2.png";
import ButtonOfSearch from "../../assets/photo/Button.png";
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

        {/* SEARCH BOX */}
        <div className="bg-white p-4 md:p-5 rounded-md w-full md:w-[500px] lg:w-[760px] mt-6">
          
          <div className="flex gap-2">
            <button>
              <img src={tap1} className="w-24 md:w-32" />
            </button>

            <button>
              <img src={tap2} className="w-24 md:w-32" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4 items-center">
            <input
              type="text"
              className="w-full bg-[#F5F5F5] rounded-md px-3 py-2"
              placeholder="Enter Your Address"
            />

            <button className="w-full md:w-auto">
              <img src={ButtonOfSearch} className="w-32 md:w-40" />
            </button>
          </div>
        </div>

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
