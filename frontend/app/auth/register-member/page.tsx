import Link from "next/link";

export default function Register() {
  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="rounded-2xl shadow-2xl flex w-full max-w-4xl">
        
        {/* Sign up Section */}
        <div className="w-3/5 flex flex-col justify-center" style={{ padding: "80px 72px" }}>
          <div className="font-bold mb-4">
            <Link href="/" className="text-xl font-bold text-black-500 text-sm hover:underline">The Local Kitchen</Link>
          </div>
          <h2 className="text-4xl font-bold text-black-500 mb-4">Create an Account</h2>
          <div style={{ marginBottom: "48px" }}></div>
          
          {/* Form */}
          <div className="flex flex-col w-full max-w-sm" style={{ gap: "28px" }}>
            <div className="flex flex-col" style={{ gap: "8px" }}>
              <label className="text-sm font-semibold text-gray-500">Email</label>
              <input
                type="email"
                className="bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ padding: "18px 20px", fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col" style={{ gap: "8px" }}>
              <label className="text-sm font-semibold text-gray-500">Password</label>
              <input
                type="password"
                className="bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ padding: "18px 20px", fontSize: "16x" }}
              />
            </div>
            <div className="flex flex-col" style={{ gap: "8px" }}>
              <label className="text-sm font-semibold text-gray-500">Confirm Password</label>
              <input
                type="password"
                className="bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ padding: "18px 20px", fontSize: "16px" }}
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition cursor-pointer"
              style={{ padding: "20px", fontSize: "16px", marginTop: "8px" }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Sign in Section */}
        <div className="w-2/5 bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl flex flex-col justify-center items-center text-center" style={{ padding: "72px 56px" }}>
          <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
          <div style={{ marginBottom: "28px" }}></div>
          <p className="text-green-50 leading-relaxed" style={{ marginBottom: "48px", fontSize: "16px" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
