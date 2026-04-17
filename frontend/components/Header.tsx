"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  username: string;
  pfp: string | null;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="bg-red-600 w-full z-10 relative">
      <div className="grid grid-cols-3 h-14 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/TLKLogo.png"
              width={110}
              height={110}
              alt="The Local Kitchen Logo"
              className="h-13 w-40 object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-8 font-medium">
          <Link
            href="/"
            className="text-white text-base hover:text-gray-200 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white text-base hover:text-gray-200 transition"
          >
            About
          </Link>
          <Link
            href="/posts"
            className="text-white text-base hover:text-gray-200 transition"
          >
            Blog
          </Link>
          <Link
            href="/restaurants"
            className="text-white text-base hover:text-gray-200 transition"
          >
            Restaurants
          </Link>
          <Link
            href="/contact"
            className="text-white text-base hover:text-gray-200 transition"
          >
            Contact
          </Link>
        </div>

        {/* Right side — Login or Avatar + Cart */}
        <div
          className="flex items-center justify-end gap-4"
          style={{ paddingRight: "32px" }}
        >
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar button */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white">
                  {user.pfp ? (
                    <Image
                      src={user.pfp}
                      alt={user.username}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-3 min-w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  role="menu"
                >
                  {/* User info header */}
                  <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      {user.pfp ? (
                        <Image
                          src={user.pfp}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h6 className="text-gray-800 text-base font-semibold">
                        {user.username}
                      </h6>
                      <small className="text-gray-400">Member</small>
                    </div>
                  </li>

                  <li>
                    <Link
                      href="/account/settings/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/settings/account"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/settings/notifications"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Notifications
                    </Link>
                  </li>
                  <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-200"></li>
                  <li>
                    <Link
                      href="/posts/create-post"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Create Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/posts/my-posts"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/posts/saved-posts"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Saved Posts
                    </Link>
                  </li>
                  <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-200"></li>
                  <li>
                    <Link
                      href="/account/settings/order-history"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help-center"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Help Center
                    </Link>
                  </li>

                  {/* Sign out */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </ul>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-orange-500 text-white text-base rounded hover:bg-orange-600 transition"
              style={{ padding: "4px 12px" }}
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Image
              src="/icons/cart.svg"
              width={48}
              height={48}
              alt="Cart"
              className="h-7 w-7"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
