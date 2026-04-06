"use client";
import Link from "next/link";
import { FaUserCog, FaUser, FaLock, FaEnvelope, FaAddressBook, FaCreditCard, FaHistory, FaBookmark } from "react-icons/fa";

export default function Sidebar() {
    return (
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav className="flex flex-col gap-1">

                    <Link href="/account/settings/account" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaUserCog />
                            Account
                        </span>
                    </Link>

                    <Link href="/account/settings/profile" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaUser />
                            Profile
                        </span>
                    </Link>

                    <Link href="/account/settings/privacy" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaLock />
                            Privacy
                        </span>
                    </Link>

                    <Link href="/account/settings/notifications" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaEnvelope />
                            Notifications
                        </span>
                    </Link>

                    <Link href="/account/settings/address" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaAddressBook />
                            Address
                        </span>
                    </Link>

                    <Link href="/account/settings/payment-methods" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaCreditCard />
                            Payment Methods
                        </span>
                    </Link>

                    <Link href="/account/settings/order-history" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaHistory />
                            Order History
                        </span>
                    </Link>

                    <Link href="/account/settings/saved-posts" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="mx-4 font-medium flex items-center gap-2">
                            <FaBookmark />
                            Saved Posts
                        </span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
}
