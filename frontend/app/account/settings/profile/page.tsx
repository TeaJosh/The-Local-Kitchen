"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  city?: string;
  state?: string;
  image?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"home" | "about" | "activity">("home");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  // ================= PROFILE =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || token === "undefined" || token === "null") {
          setLoading(false);
          return;
        }

        if (!baseUrl) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${baseUrl}/api/accounts/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        setProfile(data.profile ?? data);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [baseUrl]);

  // ================= POSTS =================
  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (!baseUrl) return;

        const res = await fetch(`${baseUrl}/api/posts/`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data
          : data?.results || data?.posts || [];

        setPosts(normalized);
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
    };

    loadPosts();
  }, [baseUrl]);

  // ================= IMAGE (FIXED CLEAN LOGIC) =================
  const localImage =
    typeof window !== "undefined"
      ? localStorage.getItem("profile_image")
      : null;

  const profileImage =
    localImage ||
    (profile?.image
      ? profile.image.startsWith("http")
        ? profile.image
        : `${baseUrl}${profile.image}`
      : "https://i.pravatar.cc/150");

  // ================= LOADING =================
  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8">Failed to load profile</div>;

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    profile.username;

  // ================= POST IMAGE =================
  const getPostImage = (post: any) => {
    const img = post.image;
    if (!img) return null;

    if (img.startsWith("http") || img.startsWith("data:image")) return img;

    if (!baseUrl) return img;

    return `${baseUrl}${img.startsWith("/") ? img : `/${img}`}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-7xl p-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-14">
        {/* ================= LEFT ================= */}
        <div className="space-y-10">
          <h1 className="text-3xl font-bold">{fullName}</h1>

          {/* TABS */}
          <div className="flex gap-6 text-sm">
            {["home", "about", "activity"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`pb-3 capitalize transition ${
                  tab === t
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* HOME */}
          {tab === "home" && (
            <div className="space-y-10 max-w-3xl mx-auto">
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                posts.map((post) => {
                  const image = getPostImage(post);

                  const author =
                    post.author_name || post.username || profile.username;

                  return (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition"
                    >
                      {image && (
                        <img
                          src={image}
                          className="w-full h-72 object-cover"
                          alt="post"
                        />
                      )}

                      <div className="p-7 space-y-5">
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            {post.section}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                            {post.cuisine}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            {post.occasion}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                          {post.title || "Untitled"}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {post.city}, {post.state}
                        </p>

                        <p className="text-gray-600">{post.subheading}</p>

                        <div className="flex justify-between text-sm text-gray-500">
                          <span>By {author}</span>
                          <span>
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl mx-auto">
              <p>{profile.bio || "—"}</p>
            </div>
          )}

          {/* ACTIVITY */}
          {tab === "activity" && (
            <div className="text-gray-500">User activity will appear here.</div>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <aside>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4 sticky top-10">
            <img
              src={profileImage}
              className="w-24 h-24 rounded-full object-cover border mx-auto"
              alt={profile.username}
            />

            <div className="text-sm text-gray-600 space-y-1 text-left">
              <p>
                <b>User Name:</b> {profile.username}
              </p>
              <p>
                <b>Name:</b> {fullName}
              </p>
              <p>
                <b>Email:</b> {profile.email}
              </p>
              <p className=" overflow-y-auto">
                <b>Bio:</b> {profile.bio || "—"}
              </p>
            </div>

            <Link
              href="/account/settings/profile/edit-profile"
              className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-80 transition inline-block"
            >
              Edit Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
