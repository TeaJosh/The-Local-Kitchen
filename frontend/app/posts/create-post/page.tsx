"use client";

import Link from "next/link"
import Image from "next/image"
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNsfwCheck } from "@/hooks/use-nsfw-check";

const CUISINES = [
    "American", "Bar", "Italian", "Asian", "Pub", "Pizza", "Japanese",
    "Chinese", "Mexican", "Seafood", "Sushi", "Cafe", "Fast Food",
    "Contemporary", "Mediterranean", "French", "Deli", "Spanish", "Latin",
    "Wine Bar", "Healthy", "European", "Scandinavian", "Indian", "Thai",
    "Korean", "Middle Eastern", "Irish", "Gastropub", "Caribbean",
    "South American", "Diner", "Greek", "International", "Fusion",
    "Barbecue", "Soups", "Dining Bars", "Vietnamese", "Cantonese",
    "Israeli", "Turkish", "Grill", "Lebanese", "African", "Persian",
    "Shanghai", "Central American", "Japanese Fusion", "Szechuan",
    "Hong Kong", "Eastern European", "Brew Restaurants", "Taiwanese",
    "Cuban", "Jamaican", "Cajun & Creole", "Street Food", "Argentinian",
    "Noodles", "British", "Colombian", "Hawaiian", "Malaysian", "Georgian",
    "Southwestern", "Slow Pub", "Filipino", "Central European",
    "Neapolitan", "Southern Italian", "Australian", "German", "Tuscan",
    "Russian", "Ethiopian", "Cosmo-Mopolitan", "Pakistani", "Sicilian",
    "Moroccan", "Belgian", "Austrian", "Singapore", "Venezuelan",
    "Beijing Cuisine", "Brazilian", "Ukrainian", "Nepali", "Egyptian",
    "Afghan", "Puerto Rican", "Arabic", "Armenian", "Central Italian",
    "Burmese", "Kolkati", "Portuguese",
];

export default function CreatePost() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/auth/login");
    }, []);

    const [title, setTitle] = useState("");
    const [heading, setHeading] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [editor, setEditor] = useState<Editor | null>(null);
    const [saving, setSaving] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const { checkImage, ready } = useNsfwCheck();
    const fileRef = useRef<HTMLInputElement>(null);

    // Tags dropdown
    const [open, setOpen] = useState(false);
    const [subOpen, setSubOpen] = useState<string | null>(null);

    // One selection per group
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

    // Comments & privacy
    const [comments, setComments] = useState<string>("1");
    const [privacy, setPrivacy] = useState<string>("2");

    // Cuisines modal
    const [cuisineOpen, setCuisineOpen] = useState(false);
    const [cuisineSearch, setCuisineSearch] = useState("");

    // Draft state
    const [isDraft, setIsDraft] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return alert("No file selected. Please choose a file.");

        if (!ready) return alert("NSFW model is still loading. Try again in a moment.");

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            const img = new window.Image();
            img.src = base64;

            img.onload = async () => {
                const isNsfw = await checkImage(img);
                if (isNsfw) {
                    alert("This image contains inappropriate content and cannot be uploaded.");
                    if (fileRef.current) fileRef.current.value = "";
                    return;
                }
                setImgSrc(base64);
            };
        };

        reader.readAsDataURL(file);
    };

    const filteredCuisines = CUISINES.filter(c =>
        c.toLowerCase().includes(cuisineSearch.toLowerCase())
    );

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim() || !editor) {
            alert("Please fill in title and content");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    title,
                    subheading: heading,
                    image: imgSrc,
                    section: selectedCategory,
                    cuisine: selectedCuisine,
                    occasion: selectedOccasion,
                    city,
                    state,
                    content: editor.getHTML(),
                    allow_comments: comments === "1",
                    is_anonymous: privacy === "1",
                    is_draft: isDraft,
                    tags: {
                        category: selectedCategory,
                        cuisine: selectedCuisine,
                        occasion: selectedOccasion,
                    },
                }),
            });
            if (!res.ok) throw new Error("Failed to save");
            const post = await res.json();
            router.push(`/posts/${post.id}`);
        } catch (error) {
            alert("Failed to save post");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">

            {/* Back to Posts */}
            <Link
                href="/posts"
                className="absolute top-6 left-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="ml-1 font-bold text-base">Back</span>
            </Link>

            <div className="w-full max-w-5xl border border-gray-200 rounded-2xl bg-white" style={{ margin: "32px", padding: "32px" }}>
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-2">

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-base font-semibold text-gray-500">Title</label>
                        <input
                            type="text"
                            placeholder="Enter your blog post title here"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                        />
                    </div>

                    {/* Subheading */}
                    <div className="flex flex-col gap-1">
                        <label className="text-base font-semibold text-gray-500">Subheading</label>
                        <input
                            type="text"
                            placeholder="Enter a subheading for your post"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-1">
                        <label className="text-base font-semibold text-gray-500">Thumbnail</label>

                        {imgSrc && (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={imgSrc} fill className="object-cover" alt="Thumbnail preview" />
                                <button
                                    type="button"
                                    onClick={() => { setImgSrc(null); if (fileRef.current) fileRef.current.value = ""; }}
                                    className="absolute top-2 right-2 bg-white text-gray-700 rounded-full px-2 py-1 text-medium shadow hover:bg-gray-100"
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        {!imgSrc && (
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                            >
                                <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                                    <svg viewBox="0 0 24 24" fill="currentColor" data-slot="icon" aria-hidden="true" className="mx-auto size-12 text-gray-300">
                                        <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" fillRule="evenodd" />
                                    </svg>
                                    <p className="mb-2 text-sm">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs">SVG, PNG, or JPG (MAX. 800x400px)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                        <label className="text-base font-semibold text-gray-500">Content</label>
                        <div className="w-full border rounded-lg overflow-y-auto h-[500px]">
                            <SimpleEditor onEditorReady={(editor) => setEditor(editor)} />
                        </div>
                    </div>

                    {/* City + State */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-base font-semibold text-gray-500">City</label>
                            <input
                                type="text"
                                placeholder="e.g., Austin"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-base font-semibold text-gray-500">State</label>
                            <input
                                type="text"
                                placeholder="e.g., Texas"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Comments */}
                    <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold text-gray-500">Comments</label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="comments"
                                    value="1"
                                    checked={comments === "1"}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                                Allow comments
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="comments"
                                    value="2"
                                    checked={comments === "2"}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                                Disable comments
                            </label>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Author Privacy */}
                    <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold text-gray-500">Author Privacy</label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="1"
                                    checked={privacy === "1"}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                />
                                Change name to Anonymous
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="2"
                                    checked={privacy === "2"}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                />
                                Don't change name to Anonymous
                            </label>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold text-gray-500">Tags</label>
                        <div className="relative flex justify-left">
                            <button
                                type="button"
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-semibold shadow border"
                            >
                                Options
                            </button>

                            {open && (
                                <div className="absolute top-full mt-2 w-56 bg-white border rounded-md shadow z-50">

                                    {/* All Categories submenu */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setSubOpen(subOpen === "categories" ? null : "categories")}
                                            className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            <span>All Categories</span>
                                            {selectedCategory && (
                                                <span className="text-xs text-blue-600 font-semibold">(1)</span>
                                            )}
                                        </button>
                                        {subOpen === "categories" && (
                                            <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-md shadow">
                                                {["Guides", "Reviews", "News"].map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => setSelectedCategory(prev => prev === tag ? null : tag)}
                                                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedCategory === tag ? "font-semibold text-blue-600" : ""}`}
                                                    >
                                                        {selectedCategory === tag && <span>✓</span>}
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* All Cuisines */}
                                    <button
                                        type="button"
                                        className="flex justify-between items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => { setCuisineOpen(true); setOpen(false); setSubOpen(null); }}
                                    >
                                        <span>All Cuisines</span>
                                        {selectedCuisine && (
                                            <span className="text-xs text-blue-600 font-semibold">(1)</span>
                                        )}
                                    </button>

                                    {/* All Occasions submenu */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setSubOpen(subOpen === "occasions" ? null : "occasions")}
                                            className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            <span>All Occasions</span>
                                            {selectedOccasion && (
                                                <span className="text-xs text-blue-600 font-semibold">(1)</span>
                                            )}
                                        </button>
                                        {subOpen === "occasions" && (
                                            <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-md shadow">
                                                {["Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Business"].map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => setSelectedOccasion(prev => prev === tag ? null : tag)}
                                                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedOccasion === tag ? "font-semibold text-blue-600" : ""}`}
                                                    >
                                                        {selectedOccasion === tag && <span>✓</span>}
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selected pills */}
                        {(selectedCategory || selectedCuisine || selectedOccasion) && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200">
                                        {selectedCategory}
                                        <button type="button" onClick={() => setSelectedCategory(null)} className="hover:text-blue-900">×</button>
                                    </span>
                                )}
                                {selectedCuisine && (
                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full border border-green-200">
                                        {selectedCuisine}
                                        <button type="button" onClick={() => setSelectedCuisine(null)} className="hover:text-green-900">×</button>
                                    </span>
                                )}
                                {selectedOccasion && (
                                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-1 rounded-full border border-purple-200">
                                        {selectedOccasion}
                                        <button type="button" onClick={() => setSelectedOccasion(null)} className="hover:text-purple-900">×</button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            onClick={() => setIsDraft(false)}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                            {saving && !isDraft ? "Saving..." : "Post"}
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => { setIsDraft(true); formRef.current?.requestSubmit(); }}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                            {saving && isDraft ? "Saving..." : "Save Post"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Cuisines List */}
            {cuisineOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl flex flex-col shadow-xl max-h-[90vh]">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
                            <span className="text-base font-semibold">Cuisines</span>
                            <button
                                type="button"
                                onClick={() => setCuisineOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-4 py-2 border-b">
                            <input
                                type="text"
                                placeholder="Search"
                                value={cuisineSearch}
                                onChange={e => setCuisineSearch(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>

                        {/* 3-column checkbox grid — single select */}
                        <div className="overflow-y-auto flex-1 px-4 py-3">
                            <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                                {filteredCuisines.map(cuisine => (
                                    <label key={cuisine} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCuisine === cuisine}
                                            onChange={() => setSelectedCuisine(prev => prev === cuisine ? null : cuisine)}
                                            className="accent-black w-3.5 h-3.5 shrink-0"
                                        />
                                        <span className="truncate">{cuisine}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <button
                                type="button"
                                onClick={() => setSelectedCuisine(null)}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-800 underline"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => setCuisineOpen(false)}
                                className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
