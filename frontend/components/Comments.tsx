"use client";

import { useCallback, useEffect, useState } from "react";

type Comment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
};

type User = {
  id: number;
  username: string;
} | null;

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export default function Comments({
  postId,
  currentUser,
}: {
  postId: string;
  currentUser?: User;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // Fetch comments
  // -------------------------
  const fetchComments = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/api/posts/${postId}/comments/`, {
        cache: "no-store",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      setComments(data.comments ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments.");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // -------------------------
  // Submit comment (optimistic UI)
  // -------------------------
  const handleSubmit = async () => {
    if (sending || !text.trim()) return;

    const token = localStorage.getItem("token");

    const optimisticComment: Comment = {
      id: Date.now(),
      author: currentUser?.username ?? "You",
      content: text,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setText("");
    setSending(true);
    setError("");

    try {
      const res = await fetch(
        `${baseUrl}/api/posts/${postId}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content: text }),
        },
      );

      if (!res.ok) throw new Error("Failed to post comment");

      await fetchComments();
    } catch (err) {
      console.error(err);
      setError("Failed to post comment");

      // rollback optimistic update
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-10">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* ===================== */}
      {/* WRITE COMMENT BOX  */}
      {/* ===================== */}
      <div className="border border-gray-150 rounded-xl p-5 mb-4 bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 transition">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={5}
          disabled={sending}
          className="w-full resize-none p-4 text-sm leading-relaxed rounded-lg outline-none disabled:opacity-50"
        />
      </div>

      {/* Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleSubmit}
          disabled={sending || !text.trim()}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {sending ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500 text-sm">Loading comments...</p>}

      {/* Empty */}
      {!loading && comments.length === 0 && (
        <p className="text-gray-500 text-sm">Be the first to comment.</p>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm text-gray-900">
                {c.author}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
