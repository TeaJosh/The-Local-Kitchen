import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="bg-red-600 w-full z-10 relative"> 
      <div className="grid grid-cols-3 h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 pl-4" style={{ paddingLeft: "32px" }}>
          <Image src="/icons/logo.svg" width={48} height={48} alt="Logo" className="h-12 w-12" />
          <Link href="/" className="text-xl font-bold text-white" style={{ paddingLeft: "12px" }}>The Local Kitchen</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-8 font-medium">
          <Link href="/" className="text-white text-base hover:text-gray-200 transition">Home</Link>
          <Link href="/about" className="text-white text-base hover:text-gray-200 transition">About</Link>
          <Link href="/blog" className="text-white text-base hover:text-gray-200 transition">Blog</Link>
          <Link href="/restaurants" className="text-white text-base hover:text-gray-200 transition">Restaurants</Link>
          <Link href="/contact" className="text-white text-base hover:text-gray-200 transition">Contact</Link>
        </div>

        {/* Login + Cart */}
        <div className="flex items-center justify-end gap-4" style={{ paddingRight: "32px" }}>
          <Link href="/auth/login" className="bg-orange-500 text-white py-2 px-4 text-base rounded hover:bg-orange-600 transition" style={{ padding: "4px 12px" }}>Login</Link>
          <Link href="/not-found.tsx"><Image src="/icons/cart.svg" width={48} height={48}  alt="Cart" className="h-7 w-7" /></Link>
        </div>
      </div>
    </nav>
  );
}
