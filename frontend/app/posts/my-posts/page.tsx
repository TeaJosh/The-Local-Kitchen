"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  image: string;
  section: string;
  cuisine: string;
  occasion: string;
  title: string;
  subheading: string;
  city: string;
  state: string;
  author: string;
  created_at: string;
};

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      const res = await fetch(`${baseUrl}/api/posts/`);
      if (!res.ok) return;

      const data = await res.json();
      const allPosts: Post[] = data.posts;

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const filtered = allPosts.filter((post) => post.author === user.username);

      setPosts(allPosts);
      setMyPosts(filtered);
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div
        className="w-full max-w-7xl flex justify-center mb-10"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <h1 className="text-3xl font-bold">My Posts</h1>
      </div>

      {/* Posts grid */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {myPosts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No posts yet.
            </p>
          )}

          {myPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block w-full max-w-md"
            >
              <div className="flex flex-col items-center text-center">
                {post.image && (
                  <Image
                    src={post.image}
                    width={500}
                    height={350}
                    alt="Blog card image"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex gap-2 mb-3 flex-wrap justify-center">
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

                <h2 className="text-3xl font-bold">{post.title}</h2>

                <p className="text-xs text-gray-500 mt-1">
                  {post.city}, {post.state}
                </p>

                <p className="text-gray-500 mt-2">{post.subheading}</p>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-4 w-full">
                  <span>By {post.author}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
