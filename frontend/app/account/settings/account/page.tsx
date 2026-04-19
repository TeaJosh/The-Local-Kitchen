"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaUserCog, FaUser, FaLock, FaEnvelope, FaAddressBook, FaCreditCard, FaHistory, FaBookmark, FaExclamationTriangle } from "react-icons/fa";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function AccountPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [accountCreated, setAccountCreated] = useState("");

    // Email change fields
    const [newEmail, setNewEmail] = useState("");
    const [confirmNewEmail, setConfirmNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");

    // Password change fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const passwordValid = passwordRegex.test(newPassword);

    const passwordCriteria = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
        specialChar: /[@$!%*?&]/.test(newPassword),
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/auth/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/me/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(async (res) => {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Unauthorized");
                }

                if (!res.ok) {
                    throw new Error("Server error");
                }

                return res.json();
            })
            .then(data => {
                setUsername(data.username);
                setEmail(data.email ?? "Not set");

                setAccountCreated(
                    new Date(data.date_joined).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                );
            })
            .catch((err) => {
                console.error("Profile fetch failed:", err);

                // ONLY logout if truly unauthorized
                if (err.message === "Unauthorized") {
                    localStorage.removeItem("token");
                    router.push("/auth/login");
                }
            });
    }, [router]);

    async function handleEmailChange() {
        if (!newEmail || !confirmNewEmail || !emailPassword) {
            alert("Please fill in all the fields.");
            return;
        }

        if (newEmail !== confirmNewEmail) {
            alert("Emails do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/change_email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                    new_email: newEmail,
                    current_password: emailPassword,
                }),
            });

            if (!res.ok) throw new Error("Failed to change email");

            alert("Email changed successfully.");
            setEmail(newEmail);
            setNewEmail(""); setConfirmNewEmail(""); setEmailPassword("");

        } catch {
            alert("Failed to change email.");
        }
    }

    async function handlePasswordChange() {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/change_password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!res.ok) throw new Error("Failed to change password");

            alert("Password changed successfully.");
            setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");

        } catch {
            alert("Failed to change password.");
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
            alert("Failed to delete account.");
        }
    }

    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1 p-12 flex flex-col items-center gap-6">
                <h1 className="text-2xl font-bold">Account Settings</h1>
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <h2 className="text-lg font-semibold">Public Profile</h2>
                    <p className="text-base font-medium">This is the main profile that will be visible to everyone</p>
                    <p><strong>Username:</strong> {username}</p>
                    <p><strong>Email:</strong> {email ?? "Not set"}</p>
                    <p><strong>Account Created:</strong> {accountCreated}</p>
                    <Link href="/account/settings/profile" className="text-sm text-blue-500 hover:underline">Edit Profile</Link>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <label className="text-lg font-semibold">Email</label>

                    <label className="text-sm text-gray-600">New Email</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                        required
                    />

                    <label className="text-sm text-gray-600">Confirm New Email</label>
                    <input
                        type="email"
                        value={confirmNewEmail}
                        onChange={(e) => setConfirmNewEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                        required
                    />

                    <label className="text-sm text-gray-600">Enter Password</label>
                    <input
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <button
                        onClick={handleEmailChange}
                        className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition self-start"
                    >
                        Change Email
                    </button>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-4 p-6 border rounded-xl w-full max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-semibold">Password</p>
                        <label className="text-sm text-gray-600">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full max-w-md">
                        <label className="text-sm text-gray-600">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                minLength={8}
                                maxLength={64}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    setPasswordTouched(true);
                                }}
                                className={`w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition duration-300 ease
                                    ${passwordTouched && newPassword.length > 0
                                        ? passwordValid
                                            ? "bg-transparent text-green-500 border border-green-200 focus:border-green-500 hover:border-green-300 focus:shadow shadow-sm"
                                            : "bg-transparent text-red-500 border border-red-200 focus:border-red-500 hover:border-red-300 focus:shadow shadow-sm"
                                        : "border border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Password strength criteria */}
                        {passwordTouched && newPassword.length > 0 && (
                            <ul className="mt-1 space-y-1 text-xs">
                                {[
                                    { key: "length", label: "At least 8 characters" },
                                    { key: "uppercase", label: "One uppercase letter (A–Z)" },
                                    { key: "lowercase", label: "One lowercase letter (a–z)" },
                                    { key: "number", label: "One number (0–9)" },
                                    { key: "specialChar", label: "One special character (@$!%*?&)" },
                                ].map(({ key, label }) => (
                                    <li
                                        key={key}
                                        className={`flex items-center gap-2 ${passwordCriteria[key as keyof typeof passwordCriteria]
                                            ? "text-green-500"
                                            : "text-red-500"
                                            }`}
                                    >
                                        <span className="font-bold">
                                            {passwordCriteria[key as keyof typeof passwordCriteria] ? "✓" : "✗"}
                                        </span>
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <label className="text-sm text-gray-600">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full max-w-md"
                    />
                    <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition self-start"
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
                            className="px-4 py-2 border border-blue-400 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition self-start"
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
                                className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium font-semibold text-sm hover:bg-red-700 active:scale-95 transition"
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
