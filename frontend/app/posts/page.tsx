import Link from "next/link";
import Image from "next/image";

async function getPosts() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/posts/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts;
}

export default async function Blog() {
    const posts = await getPosts();

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog</h1>
            </div>
            <div className="space-y-4">
                {posts.length === 0 && (
                    <p className="text-gray-500">No posts yet.</p>
                )}
                {posts.map((
                    post: { 
                        id: string; 
                        image: string; 
                        section: string;
                        cusine: string;
                        occasion: string; 
                        title: string; 
                        subheading: string; 
                        city: string; 
                        state: string; 
                        author: string; 
                        created_at: string 
                    }) => (
                    <Link key={post.id} href={`/posts/${post.id}`}>
                        <div className="border rounded-lg p-6 hover:bg-slate-50">
                            {post.image && (
                                <Image
                                    src={post.image}
                                    width={500}
                                    height={500}
                                    alt="Blog card image"
                                />
                            )}
                            <p className="text-gray-500">{post.section}, {post.cusine}, {post.occasion}</p>
                            <h2 className="text-2xl font-bold">{post.title}</h2> 
                            <p className="text-xs text-gray-500">{post.city}, {post.state}</p>
                            
                            <p className="text-gray-500">{post.subheading}</p>
                            <p className="text-base text-slate-500 mt-2">
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">By {post.author}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
};
