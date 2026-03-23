"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.detail ||
          data.email?.[0] ||
          "Login failed. Please try again."
        );
        return;
      }

      router.push("/");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="rounded-2xl shadow-2xl flex w-full max-w-4xl">
        
        {/* Sign in Section */}
        <div className="w-3/5 flex flex-col justify-center" style={{ padding: "80px 72px" }}>
          <div className="font-bold mb-4">
            <Link href="/" className="text-xl font-bold text-black-500 text-sm hover:underline">The Local Kitchen</Link>
          </div>
          <h2 className="text-4xl font-bold text-black-500 mb-4">Sign in to your account</h2>
          <div style={{ marginBottom: "48px" }}></div>

          {error && (
            <div className="mb-6 px-5 py-4 rounded-xl bg-red-100 text-red-600 text-lg font-semibold border border-red-300 flex items-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="flex flex-col w-full max-w-sm" style={{ gap: "28px" }}>
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label className="text-sm font-semibold text-gray-500">Password</label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                  style={{ padding: "18px 20px", fontSize: "16px" }}
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition cursor-pointer"
                style={{ padding: "20px", fontSize: "18px", marginTop: "8px" }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>

        {/* Sign up Section */}
        <div className="w-2/5 bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl flex flex-col justify-center items-center text-center" style={{ padding: "72px 56px" }}>
          <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
          <div style={{ marginBottom: "28px" }}></div>
          <p className="text-green-50 leading-relaxed" style={{ marginBottom: "48px", fontSize: "16px" }}>
            Enter your personal details and start your journey with us.
          </p>
          <Link
            href="/auth/select-account"
            className="border-2 border-white rounded-full font-bold hover:bg-white hover:text-blue-600 cursor-pointer"
            style={{ padding: "18px 52px", fontSize: "18px" }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
