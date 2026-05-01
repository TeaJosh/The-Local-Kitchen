"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUserCog,
  FaUser,
  FaLock,
  FaEnvelope,
  FaAddressBook,
  FaCreditCard,
  FaHistory,
  FaBookmark,
} from "react-icons/fa";

export default function SettingsPage() {
  const [findability, setFindability] = useState(true);

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex flex-col gap-1">
            <Link
              href="/account/settings/account"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaUserCog />
                Account
              </span>
            </Link>
            <Link
              href="/account/settings/profile"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaUser />
                Profile
              </span>
            </Link>
            <Link
              href="/account/settings/privacy"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaLock />
                Privacy
              </span>
            </Link>
            <Link
              href="/account/settings/notifications"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaEnvelope />
                Notifications
              </span>
            </Link>
            <Link
              href="/account/settings/address"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaAddressBook />
                Address
              </span>
            </Link>
            <Link
              href="/account/settings/payment-methods"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaCreditCard />
                Payment Methods
              </span>
            </Link>
            <Link
              href="/account/settings/order-history"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaHistory />
                Order History
              </span>
            </Link>
            <Link
              href="/account/settings/saved-posts"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaBookmark />
                Saved Posts
              </span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center p-10">
        <div className="flex flex-col gap-4 p-6  w-full max-w-3xl">
          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-bold text-center text-gray-900">
              Privacy
            </h1>
            <p className="text-gray-500 mt-3 text-lg text-center">
              Manage your data, privacy settings, and account visibility.
            </p>
          </div>

          {/* CARD 1 */}
          <div className="flex flex-col gap-5 p-6 border rounded-xl w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">
              Your recently viewed listings
            </h2>

            <p className="text-gray-600 mb-6">
              Clear your recently viewed listings and we’ll no longer show them
              on the site.
            </p>

            <button className="px-6 py-3 rounded-full border text-sm hover:bg-gray-100 transition">
              Clear recently viewed listings
            </button>
          </div>

          {/* CARD 2 */}
          <div className="flex flex-col gap-5 p-6 border rounded-xl w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">Download Data</h2>

            <p className="text-gray-600">
              Download a ZIP file of your personal information in CSV and JSON
              formats.
            </p>

            <p className="text-sm text-gray-500 mt-3">
              We’ll email you when your data is ready.
            </p>

            <button className="mt-6 px-6 py-3 rounded-full border text-sm hover:bg-gray-100 transition">
              Request data download
            </button>
          </div>

          {/* CARD 4 */}
          <div className="flex flex-col gap-5 p-6 border rounded-xl w-full max-w-3xl">
            <div>
              <h2 className="text-xl font-semibold">Findability Settings</h2>
              <p className="text-gray-500 mt-2">
                Allow others to find you by email.
              </p>
            </div>

            <button
              onClick={() => setFindability(!findability)}
              className={`w-16 h-9 flex items-center rounded-full p-1 transition ${
                findability ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-7 h-7 bg-white rounded-full shadow transform transition ${
                  findability ? "translate-x-7" : ""
                }`}
              />
            </button>
          </div>
          {/* CARD 5 */}

          <div className="flex flex-col gap-5 p-6 border rounded-xl w-full max-w-8xl">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  We use cookies and similar technologies to make your visit
                  smoother and to help us improve your experience with us.
                </p>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Do Not “Sell” or “Share” My Personal Info
                  </p>

                  <p>
                    We do not sell or share your personal information. We
                    respect your privacy and keep your data safe and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

