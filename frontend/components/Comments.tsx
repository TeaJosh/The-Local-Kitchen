"use client";

import { useCallback, useEffect, useState } from "react";

type Comment = {
  id: number;
  author: any;
  content: string;
  created_at: string;
};

type User = {
  id: number;
  username: string;
  image?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

/* ---------------- HELPERS ---------------- */
const getAuthor = (author: any) => {
  if (!author) return "unknown";
  if (typeof author === "string") return author;
  if (typeof author === "number") return String(author);
  if (typeof author === "object") return author.username || "unknown";
  return "unknown";
};

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  /* ---------------- FETCH COMMENTS ---------------- */
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

  /* ---------------- SUBMIT COMMENT ---------------- */
  const handleSubmit = async () => {
    if (sending || !text.trim()) return;

    const token = localStorage.getItem("token");

    const optimistic: Comment = {
      id: Date.now(),
      author: currentUser?.username || "You",
      content: text,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [optimistic, ...prev]);
    const message = text;
    setText("");
    setSending(true);

    try {
      const res = await fetch(`${baseUrl}/api/posts/${postId}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: message }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      await fetchComments();
    } catch (err) {
      console.error(err);
      setError("Failed to post comment");
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const handleDelete = async (commentId: number) => {
    if (deletingId === commentId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmDelete) return;

    setDeletingId(commentId);

    const token = localStorage.getItem("token");
    const previous = [...comments];

    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      const res = await fetch(`${baseUrl}/api/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment");
      setComments(previous);
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------- OWNERSHIP CHECK ---------------- */
  const canDelete = (comment: Comment) => {
    if (!currentUser) return false;

    // safest check: ID match (preferred)
    if (typeof comment.author === "object" && comment.author?.id) {
      return comment.author.id === currentUser.id;
    }

    return getAuthor(comment.author) === currentUser.username;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* INPUT */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
        disabled={sending}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={handleSubmit}
          disabled={sending || !text.trim()}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg"
        >
          {sending ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading comments...</p>}

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="relative border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* DELETE BUTTON */}
            {canDelete(c) && (
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full
                text-gray-400 hover:text-red-500 hover:bg-gray-100"
                aria-label="Delete comment"
              >
                {deletingId === c.id ? "…" : "×"}
              </button>
            )}

            <div className="font-semibold text-sm mb-1">
              {getAuthor(c.author)}
            </div>

            <p className="text-gray-700">{c.content}</p>

            <div className="text-xs text-gray-400 mt-2">
              {new Date(c.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}