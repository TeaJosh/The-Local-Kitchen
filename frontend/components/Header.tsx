// frontend/components/Header.tsx
import Link from "next/link";
export default function Header() {
  return (
    <nav className="bg-red-600 w-full z-10 relative"> 
      <div className="grid grid-cols-3 h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 pl-4">
          <img src="/logo.jpg" alt="Logo" className="h-12 w-12" />
          <Link href="/" className="text-xl font-bold text-white">The Local Kitchen</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-8 font-medium">
          <Link href="/" className="text-white hover:text-gray-200 transition">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-200 transition">About</Link>
          <Link href="/blog" className="text-white hover:text-gray-200 transition">Blog</Link>
          <Link href="/restaurants" className="text-white hover:text-gray-200 transition">Restaurants</Link>
          <Link href="/contact" className="text-white hover:text-gray-200 transition">Contact</Link>
        </div>

        {/* Login + Cart */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/auth/login" className="bg-orange-500 text-white px-6 py-3 text-lg rounded hover:bg-orange-600 transition">Login</Link>
          <Link href="/cart" className="text-white"><img src="/cart.svg" alt="Cart" className="h-7 w-7" /></Link>
        </div>
      </div>
    </nav>
  );
}
