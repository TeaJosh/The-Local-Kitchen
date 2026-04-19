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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.length === 0 && (
                    <p className="text-gray-500 col-span-full">No posts yet.</p>
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
                    <Link key={post.id} href={`/posts/${post.id}`} className="block">
                        <div className="flex flex-col">
                            {post.image && (
                                <Image
                                    src={post.image}
                                    width={250}
                                    height={250}
                                    alt="Blog card image"
                                    className="w-full h-48 object-cover rounded-md mb-3"
                                />
                            )} 

                                {/* Tags */}
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    <span className="px-2 py-1 rounded-full bg-gray-200 text-xs font-semibold">
                                        {post.section}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-gray-200 text-xs font-semibold">
                                        {post.cusine}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-gray-200 text-xs font-semibold">
                                        {post.occasion}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold">{post.title}</h2>
                                <p className="text-xs text-gray-500">{post.city}, {post.state}</p>
                                <p className="text-gray-500">{post.subheading}</p>

                                {/* Author + Date */}
                                <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                                    <span>By {post.author}</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div> 
                    </Link>
                ))}
            </div>
        </div>
    )
};
