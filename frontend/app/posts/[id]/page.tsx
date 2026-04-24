// import Comments from "@/components/Comments";

/**
 * Fetches a single post by ID from the backend API.
 * Returns null if the post is not found or the request fails.
 * Uses no-store to always fetch fresh data and avoid stale post content.
 * @param id - The post ID from the dynamic route parameter
 * @returns Parsed post object, or null on failure
 */
async function getPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/posts/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
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
  params: { id: string };
}) {
  const post = await getPost(params.id);

  /* Handle missing or invalid post response */
  if (!post) return <div className="p-8">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">{post.heading}</p>
      <p className="text-gray-500">{post.subheading}</p>

      {/* Featured image (if available) */}
      {post.imgSrc && (
        <img src={post.imgSrc} className="mt-4 rounded-xl" />
      )}

      {/*
        Post content rendered as trusted HTML from the backend CMS.
        dangerouslySetInnerHTML is intentional here — content is authored
        internally and sanitized server-side before storage.
      */}

      <div
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/*
        Comments section (currently disabled)
        Uncomment when backend supports comments API
      */}
      {/*
      {post.commentsEnabled && (
        <Comments postId={post.id} currentUser="" />
      )}
        */}
    </div>
  );
}
