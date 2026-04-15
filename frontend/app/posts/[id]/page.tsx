// import Comments from "@/components/Comments";

async function getPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/posts/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) return <div className="p-8">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <p className="text-gray-500">{post.heading}</p>

      {post.imgSrc && (
        <img src={post.imgSrc} className="mt-4 rounded-xl" />
      )}

      <div
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/*
      {post.commentsEnabled && (
        <Comments postId={post.id} currentUser="" />
      )}
        */}
    </div>
  );
}
