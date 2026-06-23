"use client";

import { useCallback, useEffect, useState } from "react";

type Comment = {
  id: number;
  author: any;
  content: string;
  created_at: string;
  replies?: Comment[];
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

/* Helper function to get the author name */
const getAuthor = (author: any) => {
  if (!author) return "unknown";
  if (typeof author === "string") return author;
  if (typeof author === "number") return String(author);
  if (typeof author === "object") return author.username || "unknown";
  return "unknown";
};

/* Reply Form */
function ReplyForm({
  commentId,
  postId,
  currentUser,
  onReplied,
}: {
  commentId: number;
  postId: string;
  currentUser: User | null;
  onReplied: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (sending || !text.trim()) return;
    setSending(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${baseUrl}/api/comments/${commentId}/replies/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      setText("");
      onReplied();
    } catch (err) {
      console.error(err);
      setError("Failed to post reply.");
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid #e5e7eb" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={3}
        disabled={sending}
        style={{
          width: "100%",
          background: "#f3f4f6",
          borderRadius: "12px",
          padding: "12px 16px",
          border: "none",
          fontSize: "0.875rem",
          color: "#1e293b",
          resize: "vertical",
          outline: "none",
          marginBottom: "0.5rem",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{error}</p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSubmit}
          disabled={sending || !text.trim()}
          style={{
            backgroundColor: "#f97316",
            color: "#fff",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            borderRadius: "9999px",
            whiteSpace: "nowrap",
            cursor: sending || !text.trim() ? "not-allowed" : "pointer",
            border: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            opacity: sending || !text.trim() ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!sending && text.trim()) e.currentTarget.style.backgroundColor = "#ea580c";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          {sending ? "Posting..." : "Post Reply"}
        </button>
      </div>
    </div>
  );
}

/* Single Comment Card */
function CommentCard({
  comment,
  postId,
  currentUser,
  deletingId,
  onDelete,
  onReplied,
  depth,
}: {
  comment: Comment;
  postId: string;
  currentUser: User | null;
  deletingId: number | null;
  onDelete: (id: number) => void;
  onReplied: () => void;
  depth: number;
}) {
  const [showReply, setShowReply] = useState(false);

  const authorName = getAuthor(comment.author);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorImage =
    typeof comment.author === "object" && comment.author?.image
      ? comment.author.image
      : null;

  const canDelete = () => {
    if (!currentUser) return false;
    if (typeof comment.author === "object" && comment.author?.id) {
      return comment.author.id === currentUser.id;
    }
    return authorName === currentUser.username;
  };

  return (
    <div style={{ marginLeft: depth > 0 ? "2rem" : "0" }}>
      <div
        style={{
          position: "relative",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          marginBottom: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        
        {/* Delete Button */}
        {canDelete() && (
          <button
            onClick={() => onDelete(comment.id)}
            disabled={deletingId === comment.id}
            aria-label="Delete comment"
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              width: "1.5rem",
              height: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            {deletingId === comment.id ? "…" : "×"}
          </button>
        )}

        {/* Author Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
          {authorImage ? (
            <img
              src={
                authorImage.startsWith("http")
                  ? authorImage
                  : `${baseUrl}${authorImage}`
              }
              alt={authorName}
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                backgroundColor: "#f97316",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.8rem",
                flexShrink: 0,
              }}
            >
              {authorInitial}
            </div>
          )}

          {/* Name + Date */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e293b", margin: 0 }}>
              {authorName}
            </p>
            <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}></span>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: 0 }}>
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <p style={{ fontSize: "0.9375rem", color: "#1e293b", margin: "0 0 0.75rem 0", lineHeight: 1.6 }}>
          {comment.content}
        </p>

        {/* Reply Button */}
        {depth === 0 && (
          <button
            onClick={() => setShowReply((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "#6b7280",
              fontWeight: 500,
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f97316")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
            </svg>
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}

        {/* Reply Form */}
        {showReply && depth === 0 && (
          <ReplyForm
            commentId={comment.id}
            postId={postId}
            currentUser={currentUser}
            onReplied={() => {
              setShowReply(false);
              onReplied();
            }}
          />
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUser={currentUser}
              deletingId={deletingId}
              onDelete={onDelete}
              onReplied={onReplied}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Main Comments Component */
export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /* Load User */
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

  /* Fetch Comments */
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

  /* Submit Comment */
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

  /* Delete Comment */
  const handleDelete = async (commentId: number) => {
    if (deletingId === commentId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
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

  /* UI */
  return (
    <div style={{ marginTop: "3rem", marginBottom: "5rem" }}>

      {/* Heading */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem" }}>
        Comments ({comments.length})
      </h2>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</p>
      )}

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
        disabled={sending}
        style={{
          width: "100%",
          background: "#f3f4f6",
          borderRadius: "12px",
          padding: "18px 20px",
          border: "none",
          fontSize: "0.9375rem",
          color: "#1e293b",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "0.75rem",
        }}
      />

      {/* Post Comment Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2.5rem" }}>
        <button
          onClick={handleSubmit}
          disabled={sending || !text.trim()}
          style={{
            backgroundColor: "#f97316",
            color: "#fff",
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            paddingTop: "0.625rem",
            paddingBottom: "0.625rem",
            borderRadius: "9999px",
            whiteSpace: "nowrap",
            cursor: sending || !text.trim() ? "not-allowed" : "pointer",
            border: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            opacity: sending || !text.trim() ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!sending && text.trim()) e.currentTarget.style.backgroundColor = "#ea580c";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          {sending ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {loading && (
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Loading comments...</p>
      )}

      {/* Comments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            postId={postId}
            currentUser={currentUser}
            deletingId={deletingId}
            onDelete={handleDelete}
            onReplied={fetchComments}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}
