// frontend/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="py-8 px-4 mx-auto max-w-screen-xl transform -translate-y-32 lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center gap-2 flex flex-col items-center">
          <h1 className="mb-4 text-6xl tracking-tight font-extrabold lg:text-9xl text-blue-500">404</h1>
          <p className="mb-4 text-2xl tracking-tight font-bold md:text-4xl">Page Not Found.</p>
          <p className="mb-4 text-lg text-slate-800" style={{ margin: "8px" }}>Sorry, the page you are looking for does not exist.</p>
          <Link href="/" className="px-10 py-4 text-xl bg-blue-500 text-white rounded-md hover:bg-blue-600" style={{ padding: "8px" }}>Back to Homepage</Link>
        </div>
        </div>
      </main>
  );
}
