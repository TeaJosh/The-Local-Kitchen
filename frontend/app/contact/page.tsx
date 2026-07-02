"use client"
import { useState } from "react";

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

/**
 * Contact — Allows any user (logged in or anonymous) to send a message.
 * @param props - None
 */
export default function Contact() {
  const [formData, setFormData] = useState({ phoneNumber: "" });
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneValid = phoneRegex.test(formData.phoneNumber);

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
  }

  /**
   * Handles form submission by collecting form data and sending it to the contact API.
   * @param e - The form submission event
   */
  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Check if user has entered a phone number and if it's valid before submitting
    if (phoneTouched && formData.phoneNumber.length > 0 && !phoneValid) {
      alert("Please enter a valid phone number. Format: +1 123-456-7890 or 123-456-7890");
      return;
    }

    const submittedData = new FormData(form);
    const user = localStorage.getItem("user");

    // If user is logged in, use their username as reporter, otherwise mark as "Anonymous"
    const reporter = user ? JSON.parse(user).username : "Anonymous";

    // Collects all form data
    const object = {
      ...Object.fromEntries(submittedData.entries()),
      reporter: reporter,
    };

    // Send the collected form data as JSON to the contact endpoint
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      if (!res.ok) throw new Error("Failed to submit");
      alert("Form submitted successfully!");

      // Reset the form after successful submission
      form.reset();

      setFormData({ phoneNumber: "" });
      setPhoneTouched(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit form. Please try again later.");
    }
  };

  const checklistItems = [
    "Report incorrect information",
    "Suggest a new local restaurant",
    "Ask a question",
    "Share feedback or ideas",
  ];

  return (
    <div className="min-h-screen flex justify-center" style={{ padding: "48px 24px" }}>
      <div className="w-full max-w-6xl">

        {/* Outer layout: left column in normal flow, form card absolutely positioned over it */}
        <div className="relative">

          {/* Orange top */}
          <div className="bg-orange-500 rounded-t-2xl" style={{ height: "180px", padding: "40px 48px" }}>
            <h1 className="text-white text-4xl font-semibold" style={{ marginBottom: "16px" }}>Get In Touch</h1>
            <p className="text-white text-base leading-relaxed max-w-xs">
              Feel free to contact us. Submit your queries here and we will get back to you as soon as possible.
            </p>
          </div>

          {/* White bottom — tall enough to sit behind the form card */}
          <div className="bg-white rounded-b-2xl" style={{ minHeight: "480px" }} />

          {/* Left column — normal flow, no absolute positioning, lives inside the white area */}
          <div className="absolute left-0 top-0 w-[42%] flex flex-col" style={{ paddingTop: "204px", paddingLeft: "0px" }}>

            {/* Why Contact Us */}
            <div className="max-w-xs">
              <h3 className="text-lg font-bold text-slate-800" style={{ marginBottom: "8px" }}>Why Contact Us?</h3>
              <p className="text-base text-slate-600 leading-relaxed" style={{ marginBottom: "20px" }}>
                We're here to help. Whether you have questions about local restaurants, would like to report an issue,
                or have ideas to improve the site, we'd love to hear from you.
              </p>

              {/* Checklist */}
              <ul className="flex flex-col" style={{ marginBottom: "24px" }}>
                {checklistItems.map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-base text-slate-700"
                    style={{ marginBottom: "12px" }}
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Full-width border — stretches across using negative margin to escape the 42% column */}
            <div className="border-t border-gray-200" style={{ marginBottom: "24px", width: "calc(100vw - 48px)", maxWidth: "1152px" }} />

            {/* Contact info */}
            <div className="flex flex-col gap-4 text-base text-slate-800">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                470-601-1911
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                tlk@gmail.com
              </div>
            </div>

          </div>

          {/* Floating form card — absolutely positioned on the right */}
          <div className="absolute top-8 right-8 w-[580px] bg-white rounded-2xl shadow-xl" style={{ padding: "36px" }}>
            <h2 className="text-xl font-semibold text-slate-800" style={{ marginBottom: "24px" }}>Send Us a Message</h2>

            <form onSubmit={onSubmit} className="w-full space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Full Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 block" style={{ marginBottom: "8px" }}>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter Full Name"
                    className="w-full bg-gray-100 rounded-xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ padding: "14px 16px" }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 block" style={{ marginBottom: "8px" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full bg-gray-100 rounded-xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ padding: "14px 16px" }}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 block" style={{ marginBottom: "8px" }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    maxLength={16}
                    title="Phone number format: +1 123-456-7890"
                    onChange={handleChange}
                    className="w-full bg-gray-100 rounded-xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ padding: "14px 16px" }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 block" style={{ marginBottom: "8px" }}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter Subject"
                    className="w-full bg-gray-100 rounded-xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ padding: "14px 16px" }}
                    minLength={10}
                    maxLength={100}
                    required
                  />
                </div>

                {/* Message */}
                <div className="col-span-full">
                  <label className="text-sm font-semibold text-gray-500 block" style={{ marginBottom: "8px" }}>Message</label>
                  <textarea
                    name="message"
                    placeholder="Your message"
                    minLength={40}
                    maxLength={1000}
                    className="w-full bg-gray-100 rounded-xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
                    style={{ padding: "14px 16px", minHeight: "140px" }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 transition text-white font-bold text-base rounded-full w-full cursor-pointer"
                style={{ padding: "14px 24px", marginTop: "8px" }}
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
