"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaUserCog, FaUser, FaLock, FaEnvelope, FaAddressBook, FaCreditCard, FaHistory, FaBookmark, FaExclamationTriangle } from "react-icons/fa";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sidebar nav items — shared shape with Profile / My Posts / Saved Posts so
// the active-page highlight stays consistent across every settings page.
const SIDEBAR_ITEMS = [
    { href: "/account/settings/account", icon: <FaUserCog />, label: "Account" },
    { href: "/account/settings/profile", icon: <FaUser />, label: "Profile" },
    { href: "/account/settings/privacy", icon: <FaLock />, label: "Privacy" },
    { href: "/account/settings/notifications", icon: <FaEnvelope />, label: "Notifications" },
    { href: "/account/settings/address", icon: <FaAddressBook />, label: "Address" },
    { href: "/account/settings/payment-methods", icon: <FaCreditCard />, label: "Payment Methods" },
    { href: "/account/settings/order-history", icon: <FaHistory />, label: "Order History" },
    { href: "/account/settings/saved-posts", icon: <FaBookmark />, label: "Saved Posts" },
];

export default function AccountPage() {
    const router = useRouter();
    const pathname = usePathname();

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
                Authorization: `Bearer ${token}`
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

                // Only logout if truly unauthorized
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
                    "Authorization": `Bearer ${token}`
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
                    "Authorization": `Bearer ${token}`
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
                headers: { "Authorization": `Bearer ${token}` },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            router.push("/");

        } catch {
            setShowModal(false);
            alert("Failed to delete account.");
        }
    }
    
    const labelStyle = "text-sm font-semibold text-gray-500";
    const defaultInputClass =
        "bg-gray-100 rounded-xl text-base text-gray-700 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    const inputPadding = { padding: "18px 20px" };

    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <aside
                className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r border-gray-200"
                style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px" }}
            >
                <nav className="flex flex-col gap-1" style={{ marginTop: "24px" }}>
                    {SIDEBAR_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${active ? "bg-gray-100 text-orange-500" : "text-gray-700"}`}
                                style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div
                className="flex-1 flex flex-col items-center gap-6"
                style={{ padding: "48px" }}
            >
                <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>

                {/* Public Profile */}
                <div
                    className="flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-3xl"
                    style={{ padding: "40px" }}
                >
                    <h2 className="text-lg font-semibold text-slate-800">Public Profile</h2>
                    <p className="text-sm text-gray-500">This is the main profile that will be visible to everyone</p>
                    <p className="text-base text-slate-800"><strong>Username:</strong> {username}</p>
                    <p className="text-base text-slate-800"><strong>Email:</strong> {email ?? "Not set"}</p>
                    <p className="text-base text-slate-800"><strong>Account Created:</strong> {accountCreated}</p>
                    <Link href="/account/settings/profile" className="text-sm font-semibold text-orange-500 hover:underline">
                        Edit Profile
                    </Link>
                </div>

                {/* Email Field */}
                <div
                    className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-3xl"
                    style={{ padding: "40px" }}
                >
                    <h2 className="text-lg font-semibold text-slate-800" style={{ marginBottom: "24px" }}>Email</h2>

                    <div className="flex flex-col" style={{ gap: "20px" }}>
                        <div>
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                New Email
                            </label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className={defaultInputClass}
                                style={inputPadding}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                Confirm New Email
                            </label>
                            <input
                                type="email"
                                value={confirmNewEmail}
                                onChange={(e) => setConfirmNewEmail(e.target.value)}
                                className={defaultInputClass}
                                style={inputPadding}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                Enter Password
                            </label>
                            <input
                                type="password"
                                value={emailPassword}
                                onChange={(e) => setEmailPassword(e.target.value)}
                                className={defaultInputClass}
                                style={inputPadding}
                            />
                        </div>

                        <button
                            onClick={handleEmailChange}
                            className="bg-orange-500 text-white font-bold text-base rounded-full hover:bg-orange-600 transition cursor-pointer self-start"
                            style={{ paddingLeft: "28px", paddingRight: "28px", paddingTop: "14px", paddingBottom: "14px" }}
                        >
                            Change Email
                        </button>
                    </div>
                </div>

                {/* Password Field */}
                <div
                    className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-3xl"
                    style={{ padding: "40px" }}
                >
                    <h2 className="text-lg font-semibold text-slate-800" style={{ marginBottom: "24px" }}>Password</h2>

                    <div className="flex flex-col" style={{ gap: "20px" }}>
                        <div>
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={defaultInputClass}
                                style={inputPadding}
                                required
                            />
                        </div>

                        <div className="w-full max-w-md">
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                New Password
                            </label>
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
                                    style={inputPadding}
                                    className={`w-full rounded-xl text-base focus:outline-none transition duration-300 ease
                                        ${passwordTouched && newPassword.length > 0
                                            ? passwordValid
                                                ? "bg-transparent text-green-500 border border-green-200 focus:border-green-500 hover:border-green-300 focus:shadow shadow-sm"
                                                : "bg-transparent text-red-500 border border-red-200 focus:border-red-500 hover:border-red-300 focus:shadow shadow-sm"
                                            : "bg-gray-100 text-gray-700"
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
                                <ul className="text-xs" style={{ marginTop: "8px" }}>
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
                                            style={{ marginTop: "4px" }}
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

                        <div>
                            <label className={labelStyle} style={{ display: "block", marginBottom: "8px" }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className={defaultInputClass}
                                style={inputPadding}
                            />
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            className="bg-orange-500 text-white font-bold text-base rounded-full hover:bg-orange-600 transition cursor-pointer self-start"
                            style={{ paddingLeft: "28px", paddingRight: "28px", paddingTop: "14px", paddingBottom: "14px" }}
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div
                    className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-3xl"
                    style={{ padding: "40px" }}
                >
                    <h2 className="text-lg font-semibold text-slate-800" style={{ marginBottom: "8px" }}>Delete Account</h2>
                    <p className="text-sm text-gray-500" style={{ marginBottom: "16px" }}>
                        Permanently remove your account. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-red-600 text-white font-bold text-base rounded-full hover:bg-red-700 transition cursor-pointer self-start"
                        style={{ paddingLeft: "28px", paddingRight: "28px", paddingTop: "14px", paddingBottom: "14px" }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Account Confirmation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div
                        className="flex flex-col items-center bg-white shadow-md rounded-xl border border-gray-200 w-[370px] md:w-[460px]"
                        style={{ paddingTop: "24px", paddingBottom: "24px", paddingLeft: "20px", paddingRight: "20px" }}
                    >
                        <h2 className="text-slate-800 font-semibold text-xl" style={{ marginTop: "16px" }}>Are you sure?</h2>
                        <FaExclamationTriangle className="text-red-500 text-5xl" style={{ marginTop: "12px" }} />
                        <p className="text-sm text-gray-500 text-center" style={{ marginTop: "8px" }}>
                            Do you really want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-center gap-4 w-full" style={{ marginTop: "20px" }}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccountDeletion}
                                className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-semibold text-sm hover:bg-red-700 active:scale-95 transition"
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
