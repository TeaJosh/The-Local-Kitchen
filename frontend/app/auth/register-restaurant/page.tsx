"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    restaurantName: "",
    restaurantAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneValid = phoneRegex.test(formData.phoneNumber);
  const passwordValid = passwordRegex.test(formData.password);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    specialChar: /[@$!%*?&]/.test(formData.password),
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "phoneNumber"
          ? value.replace(/[^+\d\s-]/g, "")
          : value,
    }));

    if (name === "phoneNumber") setPhoneTouched(true);
    if (name === "password") setPasswordTouched(true);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.phoneNumber && !phoneValid) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (formData.password && !passwordValid) {
      setError("Password must include at least one uppercase, one lowercase, one number, and one special character.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/register/restaurant/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName || undefined,
            last_name: formData.lastName || undefined,
            email: formData.email,
            username: formData.username,
            restaurant_name: formData.restaurantName,
            restaurant_address: formData.restaurantAddress,
            phone_number: formData.phoneNumber || undefined,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.detail ||
          data.email?.[0] ||
          data.username?.[0] ||
          data.phone_number?.[0] ||
          "Registration failed. Please try again."
        );
        return;
      }

      router.push("/auth/login");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="rounded-2xl shadow-2xl flex w-full max-w-4xl">

        {/* Sign up Section */}
        <div className="w-3/5 flex flex-col justify-center" style={{ padding: "80px 72px" }}>
          <div className="font-bold mb-4">
            <Link href="/" className="text-xl font-bold hover:underline">The Local Kitchen</Link>
          </div>

          <h2 className="text-4xl font-bold mb-6">Create a Restaurant Account</h2>

          {error && (
            <div className="mt-2 mb-4 px-5 py-4 rounded-xl bg-red-100 text-red-600 text-lg font-semibold border border-red-300 flex items-center" style={{ marginTop: "24px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}></div>

            {/* First & Last Name */}
            <div className="flex flex-col" style={{ gap: "20px" }}>
              <div className="flex" style={{ gap: "16px" }}>
                <div className="flex flex-col w-1/2" style={{ gap: "8px" }}>
                  <label className="text-sm font-semibold text-gray-500">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    style={{ padding: "18px 20px", fontSize: "16px" }}
                  />
                </div>

                <div className="flex flex-col w-1/2" style={{ gap: "8px" }}>
                  <label className="text-sm font-semibold text-gray-500">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    style={{ padding: "18px 20px", fontSize: "16px" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              {/* Username */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Username</label>
                <input
                  required
                  type="text"
                  name="username"
                  minLength={6}
                  maxLength={30}
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              {/* Restaurant Name */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Restaurant Name</label>
                <input
                  required
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              {/* Restaurant Address */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Restaurant Address</label>
                <input
                  required
                  type="text"
                  name="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={handleChange}
                  className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  maxLength={16}
                  title="Phone number format: +1 123-456-7890"
                  onChange={handleChange}
                  className={`w-full rounded-xl focus:outline-none transition duration-300 ease
                    ${phoneTouched && formData.phoneNumber.length > 0
                      ? phoneValid
                        ? "bg-transparent text-green-500 border border-green-200 focus:border-green-500 hover:border-green-300 focus:shadow shadow-sm"
                        : "bg-transparent text-red-500 border border-red-200 focus:border-red-500 hover:border-red-300 focus:shadow shadow-sm"
                      : "bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    }`}
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />

                {phoneTouched && formData.phoneNumber.length > 0 && phoneValid && (
                  <p className="flex items-center mt-1 text-xs text-green-400">Great! Your phone number is valid.</p>
                )}

                {phoneTouched && formData.phoneNumber.length > 0 && !phoneValid && (
                  <p className="flex items-center mt-1 text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 shrink-0">
                      <path fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd" />
                    </svg>
                    Please match the requested format. e.g., +1 123-456-7890
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    minLength={8}
                    maxLength={64}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl focus:outline-none transition duration-300 ease
                    ${passwordTouched && formData.password.length > 0
                        ? passwordValid
                          ? "bg-transparent text-green-500 border border-green-200 focus:border-green-500 hover:border-green-300 focus:shadow shadow-sm"
                          : "bg-transparent text-red-500 border border-red-200 focus:border-red-500 hover:border-red-300 focus:shadow shadow-sm"
                        : "bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
                      }`}
                    style={{ padding: "18px 20px", fontSize: "16px" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password strength Feedback */}
                {passwordTouched && formData.password.length > 0 && (
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

              {/* Confirm Password */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Confirm Password</label>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  minLength={8}
                  maxLength={64}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition cursor-pointer"
                style={{ padding: "20px", fontSize: "16px", marginTop: "8px" }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>

        {/* Sign in Section */}
        <div className="w-2/5 bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl flex flex-col justify-center items-center text-center" style={{ padding: "72px 56px" }}>
          <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
          <div style={{ marginBottom: "28px" }}></div>
          <p className="text-green-50 leading-relaxed" style={{ marginBottom: "48px", fontSize: "16px" }}>
            Already have an account?&nbsp;
            <Link href="/auth/login" className="text-white hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
