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

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-[1fr_2fr] gap-12">

        {/* Left gutter — empty or use for a sticky sidebar later */}
        <aside className="hidden md:block" />

        {/* Main content — sits on the right two-thirds */}
        <article>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

          {/* Meta */}
          <div className="mt-4 text-gray-500 space-y-1 text-sm">
            <p>{post.subheading}</p>
            <p>By {post.author}</p>
            <p>{new Date(post.created_at).toLocaleDateString()}</p>
          </div>

          {/* Featured image (if available) */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mt-8 rounded-xl w-full max-h-[500px] object-cover"
            />
          )}

          {/*
            Post content rendered as trusted HTML from the backend CMS.
            dangerouslySetInnerHTML is intentional here — content is authored
            internally and sanitized server-side before storage.
          */}

          <div
            className="prose prose-lg max-w-none mt-10
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3
            [&_h3]:text-xl  [&_h3]:font-bold [&_h3]:mb-2
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
            [&_li]:my-1
            [&_strong]:font-bold
            [&_p]:my-3 [&_p]:leading-relaxed"
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

        </article>
      </div>
    </main>
  );
}
