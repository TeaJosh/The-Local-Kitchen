"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCog,
  FaUser,
  FaLock,
  FaEnvelope,
  FaAddressBook,
  FaCreditCard,
  FaHistory,
  FaBookmark,
} from "react-icons/fa";

export default function EditProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [regionState, setRegionState] = useState("");
  const [zip, setZip] = useState("");
  const [bio, setBio] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const phoneValid = phone.trim() === "" || /^[+]?[\d\s-]{10,16}$/.test(phone);
  const bioValid = bio.length === 0 || (bio.length >= 20 && bio.length <= 250);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const p = data.profile;

        setFirstName(p.first_name || "");
        setLastName(p.last_name || "");
        setUsername(p.username || "");
        setEmail(p.email || "");
        setPhone(p.phone_number || "");
        setAddress1(p.address1 || "");
        setCity(p.city || "");
        setRegionState(p.state || "");
        setZip(p.zip || "");
        setBio(p.bio || "");

        if (p.image) {
          const imageUrl = p.image.startsWith("http")
            ? p.image
            : `${baseUrl}${p.image}`;
          setPreview(imageUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, baseUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePic(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      localStorage.setItem("profile_image", base64);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    setPhoneTouched(true);

    if (!bioValid) return alert("Bio must be 20–250 characters");
    if (!phoneValid) return alert("Invalid phone number format");

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("bio", bio);
      formData.append("address1", address1);
      formData.append("city", city);
      formData.append("state", regionState);
      formData.append("zip", zip);

      if (profilePic) formData.append("profile_picture", profilePic);

      const res = await fetch(`${baseUrl}/api/accounts/profile/update/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      // Fetch updated profile to get the server image URL
      const profileRes = await fetch(`${baseUrl}/api/accounts/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      const p = profileData.profile;

      const stored = localStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        if (p.image) {
          userData.pfp = p.image.startsWith("http") ? p.image : `${baseUrl}${p.image}`;
        }
        userData.username = username;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      window.location.href = "/account/settings/profile";
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-base text-slate-800" style={{ padding: "32px" }}>
        Loading...
      </div>
    );

  const navItems = [
    { href: "/account/settings/account", icon: <FaUserCog />, label: "Account" },
    { href: "/account/settings/profile", icon: <FaUser />, label: "Profile" },
    { href: "/account/settings/privacy", icon: <FaLock />, label: "Privacy" },
    { href: "/account/settings/notifications", icon: <FaEnvelope />, label: "Notifications" },
    { href: "/account/settings/address", icon: <FaAddressBook />, label: "Address" },
    { href: "/account/settings/payment-methods", icon: <FaCreditCard />, label: "Payment Methods" },
    { href: "/account/settings/order-history", icon: <FaHistory />, label: "Order History" },
    { href: "/account/settings/saved-posts", icon: <FaBookmark />, label: "Saved Posts" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r border-gray-200"
        style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px" }}
      >
        <nav className="flex flex-col gap-1" style={{ marginTop: "24px" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex justify-center" style={{ padding: "32px" }}>
        <div
          className="bg-white w-full max-w-4xl rounded-xl shadow-sm"
          style={{ padding: "40px" }}
        >
          <h1
            className="text-2xl font-bold text-slate-800"
            style={{ marginBottom: "24px" }}
          >
            Edit Profile
          </h1>

          <form onSubmit={handleSave} className="flex flex-col" style={{ gap: "24px" }}>
            {/* Image */}
            <div className="flex items-center gap-4">
              <img
                src={preview || "https://i.pravatar.cc/100"}
                className="w-20 h-20 rounded-full object-cover"
              />
              <input type="file" onChange={handleImageChange} />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={setFirstName}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={setLastName}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className="text-sm font-semibold text-gray-500"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneTouched(true);
                }}
                style={{ padding: "18px 20px" }}
                className={`w-full rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  phoneTouched && !phoneValid
                    ? "bg-transparent border border-red-200 text-red-500"
                    : "bg-gray-100 text-gray-700"
                }`}
              />
              {phoneTouched && !phoneValid && (
                <p className="text-xs text-red-500" style={{ marginTop: "4px" }}>
                  Invalid format. Use 10–16 digits.
                </p>
              )}
            </div>

            <Input label="Address 1" value={address1} onChange={setAddress1} />

            <div className="grid grid-cols-3 gap-4">
              <Input label="City" value={city} onChange={setCity} />
              <Input
                label="State"
                value={regionState}
                onChange={setRegionState}
              />
              <Input label="ZIP" value={zip} onChange={setZip} />
            </div>

            {/* Bio */}
            <div>
              <label
                className="text-sm font-semibold text-gray-500"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Bio
              </label>
              <textarea
                style={{ padding: "18px 20px" }}
                className={`w-full rounded-xl text-base min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  bio.length > 0 && !bioValid
                    ? "bg-transparent border border-red-200 text-red-500"
                    : "bg-gray-100 text-gray-700"
                }`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              {bio.length > 0 && !bioValid && (
                <p className="text-xs text-red-500" style={{ marginTop: "4px" }}>
                  Bio must be 20–250 characters
                </p>
              )}
            </div>

            <button
              className="w-full bg-orange-500 text-white font-bold text-base rounded-full hover:bg-orange-600 transition cursor-pointer"
              style={{ paddingTop: "14px", paddingBottom: "14px" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, readOnly }: any) {
  return (
    <div>
      <label
        className="text-sm font-semibold text-gray-500"
        style={{ display: "block", marginBottom: "8px" }}
      >
        {label}
      </label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "18px 20px" }}
        className={`w-full rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          readOnly ? "bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700"
        }`}
      />
    </div>
  );
}
