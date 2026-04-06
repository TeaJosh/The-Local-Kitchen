"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserCog, FaUser, FaLock, FaEnvelope, FaAddressBook, FaCreditCard, FaHistory, FaBookmark, FaExclamationTriangle } from "react-icons/fa";

export default function AccountPage() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            router.push("/auth/login");
            return;
        }
        const user = JSON.parse(stored);
        setUsername(user.username || "");
        setEmail(user.email || "");
    }, []);

    async function handlePasswordChange() {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/change_password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: currentPassword })
            });
            setCurrentPassword("");
        } catch {
            // Handle error (e.g. show notification)
        }
    }

    async function handleEmailChange() {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/change_email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_email: email })
            });
            setCurrentPassword("");
        } catch {
            // Handle error (e.g. show notification)
        }
    }

    async function handleAccountDeletion() {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/delete/`, {
                method: "DELETE",
                headers: { "Authorization": `Token ${token}` },
            });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/");
        } catch {
            setShowModal(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav className="flex flex-col gap-1">
                        <Link href="/account/settings/account" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaUserCog />Account</span>
                        </Link>
                        <Link href="/account/settings/profile" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaUser />Profile</span>
                        </Link>
                        <Link href="/account/settings/privacy" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaLock />Privacy</span>
                        </Link>
                        <Link href="/account/settings/notifications" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaEnvelope />Notifications</span>
                        </Link>
                        <Link href="/account/settings/address" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaAddressBook />Address</span>
                        </Link>
                        <Link href="/account/settings/payment-methods" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaCreditCard />Payment Methods</span>
                        </Link>
                        <Link href="/account/settings/order-history" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaHistory />Order History</span>
                        </Link>
                        <Link href="/account/settings/saved-posts" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            <span className="mx-4 font-medium flex items-center gap-2"><FaBookmark />Saved Posts</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            <div className="flex-1 p-12 flex flex-col items-center gap-6">
                <h1 className="text-2xl font-bold">Account Settings</h1>

                {/* Public Profile */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <label className="text-base font-semibold">Public Profile</label>
                    <p className="text-base font-medium">This is the main profile that will be visible to everyone</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        readOnly
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <Link href="/account/settings/profile" className="text-sm text-blue-500 hover:underline">Edit Profile</Link>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <label className="text-lg font-semibold">Email</label>
                    <p className="text-base font-medium font-semibold">Current Email</p>
                    <p>{email}</p>
                    <label className="text-sm text-gray-600">New Email</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <label className="text-sm text-gray-600">Confirm New Email</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <label className="text-sm text-gray-600">Enter Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <button
                        onClick={handleEmailChange}
                        className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-500 transition self-start"
                    >
                        Change Email
                    </button>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-semibold">Password</p>
                        <label className="text-base font-medium">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                        />
                    </div>
                    <label className="text-sm text-gray-600">New Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <label className="text-sm text-gray-600">Confirm New Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-500 transition self-start"
                    >
                        Change Password
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-semibold">Delete Account</p>
                        <p className="text-sm">
                            Permanently remove your account. This action cannot be undone.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-500 transition self-start"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 w-[370px] md:w-[460px] border border-gray-200">
                        <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
                        <FaExclamationTriangle className="text-red-500 text-5xl mt-3" />
                        <p className="text-sm text-gray-600 mt-2 text-center">
                            Do you really want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-5 w-full">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccountDeletion}
                                className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
