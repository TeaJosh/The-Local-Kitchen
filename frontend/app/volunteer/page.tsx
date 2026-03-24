import Link from "next/link"

export default function Volunteer() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 -translate-y-48">
      <img src="https://www.svgrepo.com/show/426192/cogs-settings.svg" alt="Gears" className="mb-8 h-100"></img>
      <h1 className="text-6xl font-bold mb-4">Coming Soon</h1>
        <p className="text-slate-800 text-lg mb-8" style={{ margin: "12px" }}>This page is under construction! We're building something amazing for you. Check back soon!</p>
          <div className="flex space-x-4">
            <Link href="/"> 
              <div className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-2 px-4 rounded-full shadow-lg transition duration-300" style={{ padding: "8px", marginTop: "8px" }}>Back to Home</div>
            </Link>
          </div>
    </div>
  );
}
