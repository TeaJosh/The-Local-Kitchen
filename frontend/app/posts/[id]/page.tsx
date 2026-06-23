import Comments from "@/components/Comments";
import DeletePostButton from "@/components/DeletePostButton";

/**
 * Fetches a single post by ID from the backend API.
 * Returns null if the post is not found or the request fails.
 * Uses no-store to always fetch fresh data and avoid stale post content.
 * @param id - The post ID from the dynamic route parameter
 * @returns Parsed post object, or null on failure
 */
async function getPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}/api/posts/${id}/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.post ?? null; // API returns { post: {...} } on success, or { error: "Not found" } on failure
}

/**
 * Page — renders a single blog post based on URL parameter ID.
 * Fetches full post content from backend API and displays it with rich HTML rendering.
 * If post is not found, displays fallback error state.
 * @param params.id - Dynamic route parameter representing post ID
 * @returns Full blog post view or "Post not found" fallback
 */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15: params is a promise that resolves to an object containing route parameters, including the post ID
}) {
  const { id } = await params; // Must await before accessing .id
  const post = await getPost(id);

  /* Handle missing or invalid post response */
  if (!post) return <div className="p-8">Post not found</div>;

  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.username || post.author_name || "Unknown";

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="max-w-3xl w-full px-6 py-10">
        {/* Title */}
        <h1 className="text-4xl font-bold text-left leading-tight" style={{ marginTop: "1rem" }}>
          {post.title}
        </h1>

        {/* Subheading */}
        {post.subheading && (
          <p className="text-gray-600 text-left mt-4 text-lg" style={{ margin: "0.5rem" }}>
            {post.subheading}
          </p>
        )}

        {/* Author + Date */}
        <div className="flex flex-col items-left gap-1 mt-4" >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {post.author?.image ? (
              <img
                src={
                  post.author.image.startsWith("http")
                    ? post.author.image
                    : `${process.env.NEXT_PUBLIC_API_URL}${post.author.image}`
                }
                className="w-10 h-10 rounded-full object-cover" style={{ marginTop: "0.5rem" }}
                alt={authorName}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm">{authorName}</span>
              <span className="text-gray-500 text-sm">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ marginTop: "1rem", marginBottom: "2rem" }}
            className="mt-10 mb-10 rounded-xl w-full max-h-[500px] object-cover shadow-md"
          />
        )}

        {/*
          Post content rendered as trusted HTML from the backend CMS.
          dangerouslySetInnerHTML is intentional here — content is authored
          internally and sanitized server-side before storage.
        */}
        <div
          className="prose prose-neutral mx-auto mt-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/*
          Comments section - only render if comments are enabled for this post (default: enabled)
          Uses allow_comments field from Django API response
        */}
        {post.allow_comments !== false && (
          <Comments postId={post.id} />
        )}
      </div>
    </div>
  );
}
