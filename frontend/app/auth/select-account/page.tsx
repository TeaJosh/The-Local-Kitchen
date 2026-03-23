"use client";

import Link from "next/link";
import { useState } from "react";

export default function SelectAccount() {
  const [selected, setSelected] = useState("member");

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">Choose Account Type</h2>

        {/* Member */}
        <div onClick={() => setSelected("member")}
            className={`p-4 mb-4 border rounded-lg cursor-pointer ${
            selected === "member" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Personal Account</h3>
              <p className="text-sm text-gray-500">
                Order food and write blog posts.
              </p>
            </div>

            {/* Radio */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === "member" ? "border-blue-500" : "border-gray-300"
            }`}>
              {selected === "member" && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Restaurant */}
        <div
          onClick={() => setSelected("restaurant")}
          className={`p-4 mb-6 border rounded-lg cursor-pointer ${
            selected === "restaurant" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Restaurant Account</h3>
              <p className="text-sm text-gray-500">Manage menu and fulfill orders.</p>
            </div>

            {/* Radio */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === "restaurant" ? "border-blue-500" : "border-gray-300"
            }`}>
              {selected === "restaurant" && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Continue */}
        <Link
          href={selected === "member" ? "/auth/register-member": "/auth/register-restaurant"}
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
            Continue →
        </Link>
      </div>
    </main>
  );
}
