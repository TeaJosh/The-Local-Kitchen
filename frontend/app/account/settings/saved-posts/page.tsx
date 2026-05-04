"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa6";
import {
  FaUserCog,
  FaUser,
  FaLock,
  FaEnvelope,
  FaAddressBook,
  FaCreditCard,
  FaHistory,
} from "react-icons/fa";

type Draft = {
  id: string;
  title: string;
  heading?: string;
  image?: string | null;
  savedAt: string;
};

export default function SavedPostsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("drafts") || "[]");
    setDrafts(data);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 min-h-screen px-4 py-8 overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex flex-col gap-1">
            <Link href="/account/settings/account" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaUserCog /> Account</span>
            </Link>
            <Link href="/account/settings/profile" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaUser /> Profile</span>
            </Link>
            <Link href="/account/settings/privacy" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaLock /> Privacy</span>
            </Link>
            <Link href="/account/settings/notifications" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaEnvelope /> Notifications</span>
            </Link>
            <Link href="/account/settings/address" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaAddressBook /> Address</span>
            </Link>
            <Link href="/account/settings/payment-methods" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaCreditCard /> Payment Methods</span>
            </Link>
            <Link href="/account/settings/order-history" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaHistory /> Order History</span>
            </Link>
            <Link href="/account/settings/saved-posts" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span className="mx-4 font-medium flex items-center gap-2"><FaBookmark /> Saved Posts</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Right Content (CENTERED) */}
      <main className="flex-1 flex justify-center p-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-6">Saved Posts</h1>

          {drafts.length === 0 ? (
            <p className="text-gray-500 text-center">No saved posts yet.</p>
          ) : (
            <div className="grid gap-4">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="border rounded-lg p-4 flex gap-4 bg-white hover:bg-gray-50"
                >
                  <Link
                    href={`/posts/create-post?draft=${d.id}`}
                    className="flex gap-4 flex-1"
                  >
                    {d.image && (
                      <div className="relative w-24 h-24">
                        <Image
                          src={d.image}
                          alt="draft"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <h2 className="font-semibold">{d.title}</h2>
                      <p className="text-sm text-gray-500">
                        Saved {new Date(d.savedAt).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      if (!window.confirm("Delete this draft?")) return;
                      const updated = drafts.filter((x) => x.id !== d.id);
                      setDrafts(updated);
                      localStorage.setItem("drafts", JSON.stringify(updated));
                    }}
                    className="text-gray-400 hover:text-red-500 text-xl self-center px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}