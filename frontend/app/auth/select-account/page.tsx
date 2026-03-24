"use client";
import Link from "next/link";
import { useState } from "react";

export default function SelectAccount() {
  const [selected, setSelected] = useState("member");

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ marginBottom: "12px" }}>Choose Account Type</h2>

        {/* Member */}
        <div
          onClick={() => setSelected("member")}
          className={`p-4 mb-4 border rounded-lg cursor-pointer ${selected === "member" ? "border-blue-500" : "border-gray-200"}`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Member</h3>
              <p className="text-base text-slate-800">Order food and write blog posts.</p>
            </div>
            <input type="radio" readOnly checked={selected === "member"} />
          </div>
        </div>

        {/* Restaurant */}
        <div
          onClick={() => setSelected("restaurant")}
          className={`p-4 mb-6 border rounded-lg cursor-pointer ${selected === "restaurant" ? "border-blue-500" : "border-gray-200"}`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Restaurant Owner</h3>
              <p className="text-base text-slate-800">Manage menu and fulfill orders.</p>
            </div>
            <input type="radio" readOnly checked={selected === "restaurant"} />
          </div>
        </div>

        {/* Continue */}
        <Link
          href={selected === "member" ? "/auth/register-member" : "/auth/register-restaurant"}
          className="block w-full bg-blue-600 text-lg text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
          Continue →
        </Link>
      </div>
    </main>
  );
}
