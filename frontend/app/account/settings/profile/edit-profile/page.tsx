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

  // =========================
  // STATE
  // =========================
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [regionState, setRegionState] = useState("");
  const [zip, setZip] = useState("");
  const [bio, setBio] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // VALIDATION
  // =========================
  const phoneValid = phone.trim() === "" || /^[+]?[\d\s-]{10,16}$/.test(phone);
  const bioValid = bio.length === 0 || (bio.length >= 20 && bio.length <= 250);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // =========================
  // LOAD PROFILE
  // =========================
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
        setAddress2(p.address2 || "");
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

  // =========================
  // IMAGE HANDLER
  // =========================
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

  // =========================
  // SAVE
  // =========================
  const handleSave = async (e: React.FormEvent) => {
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
      formData.append("address2", address2);
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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex flex-col gap-1">
            <Link
              href="/account/settings/account"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaUserCog />
                Account
              </span>
            </Link>

            <Link
              href="/account/settings/profile"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaUser />
                Profile
              </span>
            </Link>

            <Link
              href="/account/settings/privacy"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaLock />
                Privacy
              </span>
            </Link>

            <Link
              href="/account/settings/notifications"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaEnvelope />
                Notifications
              </span>
            </Link>

            <Link
              href="/account/settings/address"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaAddressBook />
                Address
              </span>
            </Link>

            <Link
              href="/account/settings/payment-methods"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaCreditCard />
                Payment Methods
              </span>
            </Link>

            <Link
              href="/account/settings/order-history"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaHistory />
                Order History
              </span>
            </Link>

            <Link
              href="/account/settings/saved-posts"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="mx-4 font-medium flex items-center gap-2">
                <FaBookmark />
                Saved Posts
              </span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex justify-center p-8">
        <div className="bg-white w-full max-w-4xl p-10 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* IMAGE */}
            <div className="flex items-center gap-4">
              <img
                src={preview || "https://i.pravatar.cc/100"}
                className="w-20 h-20 rounded-full object-cover"
              />
              <input type="file" onChange={handleImageChange} />
            </div>

            {/* NAME */}
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

            <Input
              label="Username"
              value={username}
              readOnly
              onChange={setUsername}
            />
            <Input label="Email" value={email} readOnly onChange={setEmail} />

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneTouched(true);
                }}
                className={`w-full border p-3 rounded ${phoneTouched && !phoneValid ? "border-red-500" : ""
                  }`}
              />
              {phoneTouched && !phoneValid && (
                <p className="text-xs text-red-500">
                  Invalid format. Use 10–16 digits.
                </p>
              )}
            </div>

            <Input label="Address 1" value={address1} onChange={setAddress1} />
            <Input label="Address 2" value={address2} onChange={setAddress2} />

            <div className="grid grid-cols-3 gap-4">
              <Input label="City" value={city} onChange={setCity} />
              <Input
                label="State"
                value={regionState}
                onChange={setRegionState}
              />
              <Input label="ZIP" value={zip} onChange={setZip} />
            </div>

            {/* BIO */}
            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                className={`w-full border p-3 rounded min-h-[120px] ${bio.length > 0 && !bioValid ? "border-red-500" : ""
                  }`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              {bio.length > 0 && !bioValid && (
                <p className="text-xs text-red-500">
                  Bio must be 20–250 characters
                </p>
              )}
            </div>

            <button className="w-full bg-black text-white py-3 rounded">
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
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-3 rounded"
      />
    </div>
  );
}
