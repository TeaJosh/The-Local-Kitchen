import BlogClient from "./BlogClient";

async function getPosts() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return [];

    const res = await fetch(`${baseUrl}/api/posts/`, {
        cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.posts;
}

export default async function BlogPage() {
    const posts = await getPosts();

    return <BlogClient posts={posts} />;
}