
function Footer() {
  return (
    <div>
      <footer className="bg-[#1F2937] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Food Delivery</h2>
            <p className="text-sm text-gray-300">Fast & fresh meals delivered to your doorstep.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Home</li>
              <li>Menu</li>
              <li>Restaurants</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm text-gray-300">Email: support@fooddelivery.com</p>
            <p className="text-sm text-gray-300">Phone: 9823869631</p>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} Food Delivery. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default Footer
