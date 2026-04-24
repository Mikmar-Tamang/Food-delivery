function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white py-10">

      <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Food Delivery
          </h2>
          <p className="text-sm text-gray-300">
            Fast & fresh meals delivered to your doorstep.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Menu</li>
            <li className="hover:text-white cursor-pointer">Restaurants</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-300">Email: support@fooddelivery.com</p>
          <p className="text-sm text-gray-300">Phone: 9823869631</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Food Delivery. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;