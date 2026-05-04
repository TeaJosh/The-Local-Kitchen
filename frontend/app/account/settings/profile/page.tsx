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
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-7xl p-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-14">
        {/* LEFT */}
        <div className="space-y-10">
          <h1 className="text-3xl font-bold">{fullName}</h1>

          {/* TABS */}
          <div className="flex gap-6 text-sm">
            {["home", "about", "activity"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`pb-3 capitalize ${
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
              {homePosts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                homePosts.map((post) => {
                  const image = getPostImage(post);

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
            <div className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl mx-auto">
              <p>{profile.bio || "—"}</p>
            </div>
          )}

          {/* ACTIVITY */}
          {tab === "activity" && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {activity.length === 0 ? (
                <p className="text-gray-500">No activity yet.</p>
              ) : (
                activity.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
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
                      <div className="text-xs text-gray-400 mb-1">
                        {item.type === "post" ? "🟢 Post" : " Comment"}
                      </div>

                      <p className="font-medium pr-6">
                        {item.type === "post"
                          ? item.title
                          : `You commented: "${item.title}"`}
                      </p>

                      <div className="text-xs text-gray-400 mt-2">
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
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4 sticky top-10 overflow-hidden">
            <img
              src={profileImage}
              className="w-24 h-24 rounded-full object-cover border mx-auto"
              alt={profile.username}
            />

            <div className="text-sm text-gray-600 space-y-1 text-left break-words">
              <p className="truncate">
                <b>User Name:</b> {profile.username}
              </p>
              <p className="truncate">
                <b>Name:</b> {fullName}
              </p>
              <p className="truncate">
                <b>Email:</b> {profile.email}
              </p>
              <p className="break-words">
                <b>Bio:</b> {profile.bio || "—"}
              </p>
            </div>

            <Link
              href="/account/settings/profile/edit-profile"
              className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-80 transition inline-block w-full"
            >
              Edit Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}