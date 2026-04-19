import Nav from "./Nav"
import tap1 from "../../assets/photo/Tab 1.png"
import tap2 from "../../assets/photo/Tab 2.png"
import ButtonOfSearch from "../../assets/photo/Button.png"
import headerPic from "../../assets/photo/header pic.png"

function Header() {
  return (
    <header>
        <Nav/>
        <div className="bg-[#FACD2D] shadow-inner relative overflow-hidden px-49.25 shadow-yellow-600  h-107.5">
       <h1 className="text-white font-bold text-[80px] mt-12.75 ">Are you starving?</h1>
        <p className="text-[21px] font-sans text-gray-600">Within a few clicks, find meals that are accessible near you</p>
        <br />
        {/* address box */}
        <div className="bg-white p-3.75 rounded-md w-190 h-37.75">
         <button><img src={tap1} alt="" className="w-38.75" /></button>
         <button><img src={tap2} alt="" className="w-38.75"/></button>
         <div className="flex justify-center gap-3 mt-6 items-center">
          <input type="text" className="w-full bg-[#F5F5F5] rounded-md pl-2 h-7.5 " placeholder="Enter Your Address" />
          <button><img src={ButtonOfSearch} alt="" className="w-47.5"/></button>
         </div>
        </div>
      {/* picture */}
      <img src={headerPic} className="w-110.75 absolute top-27.5 right-46.75 " alt="" />
        </div>
    </header>
  )
}

export default Header
