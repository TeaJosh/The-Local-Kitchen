"use client"
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa"; 
import { FaXTwitter } from "react-icons/fa6";

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

/**
 * Allows any user (logged in or anonymous) to report another user for violating community guidelines.
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
   * Handles form submission by collecting form data and sending it to the report API.
   * @param e - The form submission event
   */
  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user has entered a phone number and if it's valid before submitting
    if (phoneTouched && formData.phoneNumber.length > 0 && !phoneValid) {
      alert("Please enter a valid phone number. Format: +1 123-456-7890 or 123-456-7890");
      return;
    }

    const submittedData = new FormData(e.currentTarget);
    const user = localStorage.getItem("user");

    // If user is logged in, use their username as reporter, otherwise mark as "Anonymous"
    const reporter = user ? JSON.parse(user).username : "Anonymous";

    // Collects all form data
    const object = {
      ...Object.fromEntries(submittedData.entries()),
      reporter: reporter,
    };

    // Send the collected form data as JSON to the support report endpoint
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      if (!res.ok) throw new Error("Failed to submit");
      alert("Form submitted successfully!");

      // Reset the form after successful submission
      e.currentTarget.reset();

      setFormData({ phoneNumber: "" });
      setPhoneTouched(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit form. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="relative">

          {/* Purple top */}
          <div className="bg-orange-500 rounded-t-2xl h-48 px-12 py-10">
            <h1 className="text-white text-4xl font-semibold mb-2">Get In Touch</h1>
            <p className="text-white text-base leading-relaxed max-w-xs">
              Feel free to contact us. Submit your queries here and we will get back to you as soon as possible.
            </p>
          </div>


          {/* White bottom */}
          <div className="bg-white rounded-b-2xl h-48" /> 

            {/* Contact info */}
            <div className="flex flex-col gap-4 text-base text-slate-800 mb-6">
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

            <div className="border border-gray-100 width-50"></div>

            {/* Social icons */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"><FaFacebook /></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs"><FaInstagram /></div>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs"><FaXTwitter /></div>
              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs"><FaTiktok /></div>
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs"><FaYoutube /></div>
            </div>
         


          {/* Floating form card */}
          <div className="absolute top-6 right-10 w-[600px] bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Send Us a Message</h2>

            <form
              onSubmit={onSubmit}
              className="w-full p-8 bg-white rounded-xl shadow-sm space-y-5"
            >

              <div className="grid sm:grid-cols-2 gap-4">

                {/* Full Name */}
                <div>
                  <label className="text-base text-slate-900 font-medium mb-2 block">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter Full Name"
                    className="w-full py-3 px-4 text-slate-800 bg-white border border-gray-300 focus:border-slate-900 text-base outline-0 rounded-md" />
                </div>

                {/* Email */}
                <div>
                  <label className="text-base text-slate-900 font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full py-3 px-4 text-slate-800 bg-white border border-gray-300 focus:border-slate-900 text-base outline-0 rounded-md"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-base text-slate-900 font-medium mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    maxLength={16}
                    title="Phone number format: +1 123-456-7890"
                    onChange={handleChange}
                    className="w-full py-3 px-4 text-slate-800 bg-white border border-gray-300 focus:border-slate-900 text-base outline-0 rounded-md"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-base text-slate-900 font-medium mb-2 block">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter Subject"
                    className="w-full py-3 px-4 text-slate-800 bg-white border border-gray-300 focus:border-slate-900 text-base outline-0 rounded-md"
                    minLength={10}
                    maxLength={100}
                    required
                  />
                </div>

                {/* Message */}
                <div className="col-span-full">
                  <label className="text-base text-slate-900 font-medium mb-2 block">Message</label>
                  <textarea
                    name="message"
                    placeholder="Your message"
                    minLength={40}
                    maxLength={1000}
                    className="w-full px-4 h-64 text-slate-800 bg-white border border-gray-300 focus:border-slate-900 text-base pt-3 outline-0 rounded-md"
                    required
                  />
                </div>
              </div>

              <button type="submit"
                className="text-white bg-blue-500 font-medium hover:bg-blue-600 text-base px-4 py-3 w-full border-0 outline-0 rounded-md cursor-pointer mt-6">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
