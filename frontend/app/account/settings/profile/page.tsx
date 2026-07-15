"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

type Profile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  image?: string | null;
};

// Sidebar nav items — matches AccountPage.tsx exactly so every settings
// page (Account, Profile, My Posts, Saved Posts, etc.) shares the same nav.
const SIDEBAR_ITEMS = [
  { href: "/account/settings/account", icon: <FaUserCog />, label: "Account" },
  { href: "/account/settings/profile", icon: <FaUser />, label: "Profile" },
  { href: "/account/settings/privacy", icon: <FaLock />, label: "Privacy" },
  { href: "/account/settings/notifications", icon: <FaEnvelope />, label: "Notifications" },
  { href: "/account/settings/address", icon: <FaAddressBook />, label: "Address" },
  { href: "/account/settings/payment-methods", icon: <FaCreditCard />, label: "Payment Methods" },
  { href: "/account/settings/order-history", icon: <FaHistory />, label: "Order History" },
  { href: "/account/settings/saved-posts", icon: <FaBookmark />, label: "Saved Posts" },
];

export default function ProfilePage() {
  const pathname = usePathname();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [allComments, setAllComments] = useState<any[]>([]);
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

  // ================= COMMENTS =================
  useEffect(() => {
    const loadAllComments = async () => {
      if (!profile || posts.length === 0) return;

      try {
        const results: any[] = [];

        for (const post of posts) {
          try {
            const res = await fetch(
              `${baseUrl}/api/posts/${post.id}/comments/`,
            );

            if (!res.ok) continue;

            const data = await res.json();
            const comments = data.comments ?? [];

            const userComments = comments.filter((c: any) => {
              const author =
                typeof c.author === "object" ? c.author?.username : c.author;

              return author === profile.username;
            });

            userComments.forEach((c: any) => {
              results.push({
                ...c,
                postId: post.id,
              });
            });
          } catch {
            continue;
          }
        }

        setAllComments(results);
      } catch {
        console.log("Failed loading comments");
      }
    };

    loadAllComments();
  }, [posts, profile, baseUrl]);

  // ================= DELETE COMMENT =================
  const deleteComment = async (commentId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    setAllComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      await fetch(`${baseUrl}/api/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PROFILE IMAGE =================
  const profileImage =
    (typeof window !== "undefined"
      ? localStorage.getItem("profile_image")
      : null) ||
    (profile?.image
      ? profile.image.startsWith("http")
        ? profile.image
        : `${baseUrl}${profile.image}`
      : "https://i.pravatar.cc/150");

  if (loading)
    return (
      <div className="flex min-h-screen">
        <SettingsSidebar pathname={pathname} />
        <div className="flex-1 text-base text-slate-800" style={{ padding: "32px" }}>
          Loading...
        </div>
      </div>
    );
  if (!profile)
    return (
      <div className="flex min-h-screen">
        <SettingsSidebar pathname={pathname} />
        <div className="flex-1 text-base text-slate-800" style={{ padding: "32px" }}>
          Failed to load profile
        </div>
      </div>
    );

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    profile.username;

  // ================= POST IMAGE =================
  const getPostImage = (post: any) => {
    const img = post.image;
    if (!img) return null;

    if (img.startsWith("http") || img.startsWith("data:image")) return img;

    return baseUrl ? `${baseUrl}${img}` : img;
  };

  // ================= HOME POSTS (ONLY USER POSTS) =================
  const homePosts = posts.filter((post) => {
    const author =
      typeof post.author === "object"
        ? post.author?.username
        : post.author_name || post.username || post.author;

    return author === profile.username;
  });

  // ================= USER POSTS (FOR ACTIVITY ONLY) =================
  const userPosts = posts.filter((post) => {
    const author =
      typeof post.author === "object"
        ? post.author?.username
        : post.author_name || post.username || post.author;

    return author === profile.username;
  });

  // ================= ACTIVITY =================
  const activity = [
    ...userPosts.map((post) => ({
      type: "post",
      id: `post-${post.id}`,
      title: post.title,
      created_at: post.created_at,
      link: `/posts/${post.id}`,
    })),

    ...allComments.map((comment) => ({
      type: "comment",
      id: comment.id,
      title: comment.content,
      created_at: comment.created_at,
      link: `/posts/${comment.postId}`,
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SettingsSidebar pathname={pathname} />

      <div className="flex-1 flex justify-center">
        <div
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[3fr_1fr]"
          style={{ gap: "48px", padding: "40px" }}
        >
          {/* LEFT */}
          <div className="flex flex-col gap-10">
            <h1 className="text-4xl font-extrabold text-slate-800">{fullName}</h1>

            {/* TABS */}
            <div className="flex gap-6 text-sm">
              {["home", "about", "activity"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`capitalize ${
                    tab === t
                      ? "border-b-2 border-orange-500 font-semibold text-slate-800"
                      : "text-gray-500 hover:text-slate-800"
                  }`}
                  style={{ paddingBottom: "12px" }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* HOME */}
            {tab === "home" && (
              <div className="max-w-3xl flex flex-col gap-10">
                {homePosts.length === 0 ? (
                  <p className="text-gray-500">No posts yet.</p>
                ) : (
                  homePosts.map((post) => {
                    const image = getPostImage(post);

                    return (
                      <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition"
                      >
                        {image && (
                          <img
                            src={image}
                            className="w-full h-72 object-cover"
                            alt="post"
                          />
                        )}

                        <div
                          className="flex flex-col gap-5"
                          style={{ padding: "24px" }}
                        >
                          <div className="flex gap-2 flex-wrap">
                            <span
                              className="rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                              style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px" }}
                            >
                              {post.section}
                            </span>
                            <span
                              className="rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                              style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px" }}
                            >
                              {post.cuisine}
                            </span>
                            <span
                              className="rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                              style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px" }}
                            >
                              {post.occasion}
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold text-slate-800">
                            {post.title || "Untitled"}
                          </h2>

                          <p className="text-sm text-slate-700" style={{ lineHeight: "1.6" }}>
                            {post.subheading}
                          </p>

                          <div className="flex justify-between text-sm text-gray-500">
                            <span>By {post.author?.username || post.author}</span>
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
              <div
                className="max-w-3xl bg-white rounded-2xl shadow-sm"
                style={{ padding: "24px" }}
              >
                <p className="text-base text-slate-800">{profile.bio || "—"}</p>
              </div>
            )}

            {/* ACTIVITY */}
            {tab === "activity" && (
              <div className="max-w-3xl flex flex-col gap-4">
                {activity.length === 0 ? (
                  <p className="text-gray-500">No activity yet.</p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition"
                      style={{ padding: "16px" }}
                    >
                      {item.type === "comment" && (
                        <button
                          onClick={() => deleteComment(item.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}

                      <Link href={item.link}>
                        <div
                          className="text-xs text-gray-400"
                          style={{ marginBottom: "4px" }}
                        >
                          {item.type === "post" ? "Post" : " Comment"}
                        </div>

                        <p
                          className="font-medium text-slate-800"
                          style={{ paddingRight: "24px" }}
                        >
                          {item.type === "post"
                            ? item.title
                            : `You commented: "${item.title}"`}
                        </p>

                        <div
                          className="text-xs text-gray-400"
                          style={{ marginTop: "8px" }}
                        >
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <aside className="w-full max-w-sm">
            <div
              className="bg-white rounded-2xl shadow-sm flex flex-col gap-4 sticky top-10 overflow-hidden"
              style={{ padding: "24px" }}
            >
              <img
                src={profileImage}
                className="w-24 h-24 rounded-full object-cover border"
                alt={profile.username}
              />

              <div className="flex flex-col gap-1 text-sm text-gray-500 text-left break-words">
                <p className="truncate">
                  <b>User Name:</b> {profile.username}
                </p>
                <p className="truncate">
                  <b>Name:</b> {fullName}
                </p>
                <p className="truncate">
                  <b>Email:</b> {profile.email}
                </p>
              </div>

              <Link
                href="/account/settings/profile/edit-profile"
                className="bg-orange-500 text-white font-bold text-base text-center rounded-full hover:bg-orange-600 transition inline-block w-full"
                style={{ paddingTop: "14px", paddingBottom: "14px" }}
              >
                Edit Profile
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Shared settings sidebar — matches AccountPage.tsx exactly so every
// settings page shares the same navigation.
function SettingsSidebar({ pathname }: { pathname: string | null }) {
  return (
    <aside
      className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r border-gray-200"
      style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px" }}
    >
      <nav className="flex flex-col gap-1" style={{ marginTop: "24px" }}>
        {SIDEBAR_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${active ? "bg-gray-100 text-orange-500" : "text-gray-700"}`}
              style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
