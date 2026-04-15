"use client";
import React, { useState } from "react";

export default function ReportPage() {
  const [subject, setSubject] = useState("");
  const [accusedUser, setAccusedUser] = useState("");
  const [body, setBody] = useState("");
  const [showError, setShowError] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];

    if (!subject.trim()) missing.push("Subject");
    if (!accusedUser.trim()) missing.push("Accused User");
    if (!body.trim()) missing.push("Body");

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowError(true);
      return;
    }

    setMissingFields([]);
    setShowError(false);
  };

  const closeError = () => setShowError(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      {/* Error Overlay */}
      {showError && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={closeError}
        >
          <div
            className="bg-white border border-red-400 text-red-600 p-6 rounded-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-medium mb-3">Please complete all required fields:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
              {missingFields.map((field) => (
                <li key={field}>{field} is required.</li>
              ))}
            </ul>
            <button
              onClick={closeError}
              className="block w-full rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-red-500"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6 w-full"
      >
        <h1 className="text-xl font-semibold text-gray-900">Submit a Report</h1>
        <p className="text-sm text-gray-500">
          Report a user for violating our community guidelines.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-900" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 focus:border-indigo-500 focus:outline-none"
            type="text"
            placeholder="e.g. Harassment, Spam, Fraud"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900" htmlFor="accusedUser">
            Accused User
          </label>
          <input
            id="accusedUser"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 focus:border-indigo-500 focus:outline-none"
            type="text"
            placeholder="Username or email of the reported user"
            value={accusedUser}
            onChange={(e) => setAccusedUser(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            className="mt-1 w-full resize-none rounded-lg border border-gray-300 bg-white p-2 focus:border-indigo-500 focus:outline-none"
            rows={4}
            placeholder="Describe the incident in detail..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
        >
          Submit Report
        </button>
      </form>
    </main>
  );
}
