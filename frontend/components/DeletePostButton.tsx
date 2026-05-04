"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({
  postId,
  authorUsername,
}: {
  postId: number;
  authorUsername: string;
}) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setIsAuthor(user.username === authorUsername);
    }
  }, [authorUsername]);

  if (!isAuthor) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a post.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/posts/${postId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
        return;
      }

      router.push("/posts");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium transition"
    >
      Delete Post
    </button>
  );
}