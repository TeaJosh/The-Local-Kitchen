// frontend/components/Header.tsx
export default function Header() {
  return (
    <nav className="bg-red-600">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-white">The Local Kitchen</a>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <a href="/" className="text-white hover:text-gray-200">Home</a>
            <a href="/about" className="text-white hover:text-gray-200">About</a>
            <a href="/blog" className="text-white hover:text-gray-200">Blog</a>
            <a href="/restaurants" className="text-white hover:text-gray-200">Restaurants</a>
            <a href="/contact" className="text-white hover:text-gray-200">Contact</a>
          </div>

          {/* Login Button */}
          <div className="flex space-x-4">
            <a href="/login" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Login</a>
          </div>

          {/* Shopping Cart Icon */}
          <div className="flex items-center">
            <a href="/cart" className="text-white hover:text-gray-200">
              <img
                src="/cart.svg"
                alt="Shopping cart"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
