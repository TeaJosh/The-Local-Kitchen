"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useNsfwCheck } from "@/hooks/use-nsfw-check";
import { FaXmark } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";

type Post = {
  id: string;
  image: string;
  section: string;
  cuisine: string;
  occasion: string;
  vibe?: string;
  title: string;
  subheading: string;
  city: string;
  state: string;
  author: string;
  created_at: string;
  content?: string;
  allow_comments?: boolean;
  is_anonymous?: boolean;
};

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

const SECTIONS = ["Local Spotlights", "Guides", "Reviews", "No Preference"] as const;
const CONTENT_MIN = 2000;
const CONTENT_MAX = 10000;

type EditFormState = {
  id: string;
  title: string;
  subheading: string;
  city: string;
  state: string;
  section: string;
  cuisine: string;
  occasion: string;
  vibe: string;
  image: string;
  content: string;
  comments: string;
  privacy: string;
};

const mapSectionToApi = (section: string) => {
  if (section === "Local Spotlights") return "local spotlight";
  if (section === "Guides") return "guides";
  if (section === "Reviews") return "reviews";
  if (section === "No Preference") return "no preference";
  return section.toLowerCase();
};

const mapOccasionToApi = (occasion: string) => {
  if (occasion === "Date Night") return "date_night";
  if (occasion === "Fine Dining") return "fine_dining";
  if (occasion === "Group Dining") return "group_dining";
  if (occasion === "Quick Bite") return "quick_bite";
  if (occasion === "Business") return "business";
  return occasion.toLowerCase().replace(/\s+/g, "_");
};

const mapVibeToApi = (vibe: string) => vibe.toLowerCase();

const mapCuisineToApi = (cuisine: string) => {
  if (cuisine === "Fast Food") return "fast_food";
  if (cuisine === "Middle Eastern") return "middle_eastern";
  if (cuisine === "Barbecue") return "barbecue";
  if (cuisine === "Cajun & Creole") return "cajun_creole";
  if (cuisine === "Southwestern") return "southwestern";
  return cuisine.toLowerCase().replace(/&/g, "").replace(/\s+/g, "_").replace(/__+/g, "_");
};

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<EditFormState | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [comments, setComments] = useState<string>("1");
  const [privacy, setPrivacy] = useState<string>("2");
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [cuisineSearch, setCuisineSearch] = useState("");

  const { checkImage, ready } = useNsfwCheck();
  const fileRef = useRef<HTMLInputElement>(null);

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
      setMyPosts(filtered);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!editingPost) return;
    setImgSrc(editingPost.image || null);
    setSelectedSection(editingPost.section || "No Preference");
    setSelectedCuisine(editingPost.cuisine || null);
    setSelectedOccasion(editingPost.occasion || null);
    setSelectedVibe(editingPost.vibe || null);
    setComments(editingPost.comments || "1");
    setPrivacy(editingPost.privacy || "2");
    setCharCount(0);
  }, [editingPost]);

  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => {
      setCharCount(editor.getText().length);
    };

    editor.on("update", updateHandler);

    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !editingPost) return;

    editor.commands.setContent(editingPost.content || "");
    setCharCount(editor.getText().length);
  }, [editor, editingPost]);

  const filteredCuisines = useMemo(
    () => CUISINES.filter((c) => c.toLowerCase().includes(cuisineSearch.toLowerCase())),
    [cuisineSearch]
  );

  const openEdit = async (post: Post) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    try {
      const res = await fetch(`${baseUrl}/api/posts/${post.id}/`);
      const data = res.ok ? await res.json() : null;
      const p = data?.post ?? data ?? post;

      setEditingPost({
        id: String(p.id),
        title: p.title || "",
        subheading: p.subheading || "",
        city: p.city || "",
        state: p.state || "",
        section: p.section || "No Preference",
        cuisine: p.cuisine || "",
        occasion: p.occasion || "",
        vibe: p.vibe || "",
        image: p.image || "",
        content: p.content || "",
        comments: p.allow_comments === false ? "2" : "1",
        privacy: p.is_anonymous ? "1" : "2",
      });
    } catch {
      setEditingPost({
        id: post.id,
        title: post.title,
        subheading: post.subheading,
        city: post.city,
        state: post.state,
        section: post.section,
        cuisine: post.cuisine,
        occasion: post.occasion,
        vibe: post.vibe || "",
        image: post.image || "",
        content: post.content || "",
        comments: post.allow_comments === false ? "2" : "1",
        privacy: post.is_anonymous ? "1" : "2",
      });
    }
  };

  const closeEdit = () => {
    setEditingPost(null);
    setEditor(null);
    setCharCount(0);
    setImgSrc(null);
    setSelectedSection(null);
    setSelectedCuisine(null);
    setSelectedOccasion(null);
    setSelectedVibe(null);
    setComments("1");
    setPrivacy("2");
    setOpen(false);
    setSubOpen(null);
    setCuisineOpen(false);
    setCuisineSearch("");
  };

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

  const handleSave = async () => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) return alert("Please fill in title and content");
    if (!selectedSection) return alert("Please select a section, or choose 'No Preference'.");
    if (!editor) return alert("Content editor is not ready.");

    const contentText = editor.getText();
    if (contentText.length < CONTENT_MIN) {
      alert(`Content is too short. Minimum ${CONTENT_MIN} characters (currently using ${contentText.length} characters).`);
      return;
    }
    if (contentText.length > CONTENT_MAX) {
      alert(`Content is too long. Maximum ${CONTENT_MAX} characters (currently using ${contentText.length} characters).`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${editingPost.id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editingPost.title,
          subheading: editingPost.subheading,
          image: imgSrc,
          section: mapSectionToApi(selectedSection),
          cuisine: selectedCuisine ? mapCuisineToApi(selectedCuisine) : "",
          occasion: selectedOccasion ? mapOccasionToApi(selectedOccasion) : "",
          vibe: selectedVibe ? mapVibeToApi(selectedVibe) : "",
          city: editingPost.city,
          state: editingPost.state,
          content: editor.getHTML(),
          allow_comments: comments === "1",
          is_anonymous: privacy === "1",
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to save");

      setMyPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                title: editingPost.title,
                subheading: editingPost.subheading,
                city: editingPost.city,
                state: editingPost.state,
                image: imgSrc || "",
                section: selectedSection || p.section,
                cuisine: selectedCuisine || "",
                occasion: selectedOccasion || "",
                vibe: selectedVibe || "",
                created_at: p.created_at,
              }
            : p
        )
      );

      closeEdit();
      window.location.reload();
    } catch {
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPost) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${editingPost.id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to delete");

      setMyPosts((prev) => prev.filter((p) => p.id !== editingPost.id));
      closeEdit();
      window.location.reload();
    } catch {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-7xl flex justify-center mb-10" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h1 className="text-3xl font-bold">My Posts</h1>
      </div>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {myPosts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">No posts yet.</p>
          )}

          {myPosts.map((post) => (
            <div key={post.id} className="block w-full max-w-md">
              <Link href={`/posts/${post.id}`} className="block">
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
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{post.section}</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">{post.cuisine}</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">{post.occasion}</span>
                  </div>

                  <h2 className="text-3xl font-bold">{post.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{post.city}, {post.state}</p>
                  <p className="text-gray-500 mt-2">{post.subheading}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4 w-full">
                    <span>By {post.author}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => openEdit(post)}
                className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-gray-200 shadow-2xl animate-[popIn_180ms_ease-out] max-h-[90vh] overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center px-4 py-16">
              <button
                onClick={closeEdit}
                className="absolute top-6 left-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="ml-1 font-bold text-base">Cancel</span>
              </button>

              <div className="w-full max-w-5xl border border-gray-200 rounded-2xl bg-white" style={{ margin: "32px", padding: "32px" }}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-base font-semibold text-gray-500">Title</label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-base font-semibold text-gray-500">Subheading</label>
                    <input
                      type="text"
                      value={editingPost.subheading}
                      onChange={(e) => setEditingPost({ ...editingPost, subheading: e.target.value })}
                      className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-base font-semibold text-gray-500">Thumbnail</label>

                    {imgSrc && (
                      <div className="relative w-full h-128 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={imgSrc} fill className="object-cover" alt="Thumbnail preview" />
                        <button
                          type="button"
                          onClick={() => {
                            setImgSrc(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 bg-white text-gray-700 rounded-full px-2 py-1 text-medium shadow hover:bg-gray-100"
                        >
                          <IconContext.Provider value={{ size: "24px" }}>
                            <FaXmark />
                          </IconContext.Provider>
                        </button>
                      </div>
                    )}

                    {!imgSrc && (
                      <label
                        htmlFor="dropzone-file-edit"
                        className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                      >
                        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                          <p className="mb-2 text-sm">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs">SVG, PNG, or JPG (MAX. 800x400px)</p>
                        </div>
                        <input
                          id="dropzone-file-edit"
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-base font-semibold text-gray-500">Content</label>
                    <div className="w-full border rounded-lg overflow-y-auto h-[500px]">
                    <SimpleEditor
                      key={editingPost.id}
                      onEditorReady={(ed) => {
                        setEditor(ed);
                      }}
                    />
                    </div>
                    <p className={`text-xs mt-1 ${charCount < CONTENT_MIN || charCount > CONTENT_MAX ? "text-red-500" : "text-green-500"}`}>
                      {charCount} / {CONTENT_MAX} characters
                      {charCount < CONTENT_MIN && ` (minimum ${CONTENT_MIN})`}
                      {charCount > CONTENT_MAX && ` (over limit by ${charCount - CONTENT_MAX})`}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-base font-semibold text-gray-500">City</label>
                      <input
                        type="text"
                        value={editingPost.city}
                        onChange={(e) => setEditingPost({ ...editingPost, city: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-base font-semibold text-gray-500">State</label>
                      <input
                        type="text"
                        value={editingPost.state}
                        onChange={(e) => setEditingPost({ ...editingPost, state: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-3 text-base"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-gray-500">Comments</label>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="comments" value="1" checked={comments === "1"} onChange={(e) => setComments(e.target.value)} />
                        Allow comments
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="comments" value="2" checked={comments === "2"} onChange={(e) => setComments(e.target.value)} />
                        Disable comments
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-gray-500">Author Privacy</label>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="privacy" value="1" checked={privacy === "1"} onChange={(e) => setPrivacy(e.target.value)} />
                        Change name to Anonymous
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="privacy" value="2" checked={privacy === "2"} onChange={(e) => setPrivacy(e.target.value)} />
                        Don't change name to Anonymous
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-gray-500">Section</label>
                    <p className="text-xs text-gray-400">
                      Choose where this post appears on the blog page. Selecting "No Preference"
                      will place your post in Latest Posts and More Posts automatically.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {SECTIONS.map((section) => (
                        <button
                          key={section}
                          type="button"
                          onClick={() => setSelectedSection((prev) => (prev === section ? null : section))}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                            ${selectedSection === section
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                            }`}
                        >
                          {section}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-base font-semibold text-gray-500">Tags</label>

                    <div className="relative flex justify-left">
                      <button
                        type="button"
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-semibold shadow border"
                      >
                        Options
                      </button>

                      {open && (
                        <div className="absolute top-full mt-2 w-56 bg-white border rounded-md shadow z-[70]">
                          <button
                            type="button"
                            className="flex justify-between items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setCuisineOpen(true);
                              setOpen(false);
                              setSubOpen(null);
                            }}
                          >
                            <span>All Cuisines</span>
                            {selectedCuisine && <span className="text-xs text-blue-600 font-semibold">(1)</span>}
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setSubOpen(subOpen === "vibes" ? null : "vibes")}
                              className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <span>All Vibes</span>
                              {selectedVibe && <span className="text-xs text-blue-600 font-semibold">(1)</span>}
                            </button>

                            {subOpen === "vibes" && (
                              <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-md shadow z-[80]">
                                {["Cozy", "Lively", "Modern"].map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setSelectedVibe((prev) => (prev === tag ? null : tag))}
                                    className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedVibe === tag ? "font-semibold text-blue-600" : ""}`}
                                  >
                                    {selectedVibe === tag && <span>✓</span>}
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setSubOpen(subOpen === "occasions" ? null : "occasions")}
                              className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <span>All Occasions</span>
                              {selectedOccasion && <span className="text-xs text-blue-600 font-semibold">(1)</span>}
                            </button>

                            {subOpen === "occasions" && (
                              <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-md shadow z-[80]">
                                {["Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Family-Friendly"].map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setSelectedOccasion((prev) => (prev === tag ? null : tag))}
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

                    {(selectedVibe || selectedCuisine || selectedOccasion) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedVibe && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200">
                            {selectedVibe}
                            <button type="button" onClick={() => setSelectedVibe(null)} className="hover:text-blue-900">×</button>
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

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || charCount < CONTENT_MIN || charCount > CONTENT_MAX}
                      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={closeEdit}
                      disabled={saving}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cuisineOpen && editingPost && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl flex flex-col shadow-xl max-h-[90vh]">
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

            <div className="px-4 py-2 border-b">
              <input
                type="text"
                placeholder="Search"
                value={cuisineSearch}
                onChange={(e) => setCuisineSearch(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-3">
              <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                {filteredCuisines.map((cuisine) => (
                  <label key={cuisine} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCuisine === cuisine}
                      onChange={() => setSelectedCuisine((prev) => (prev === cuisine ? null : cuisine))}
                      className="accent-black w-3.5 h-3.5 shrink-0"
                    />
                    <span className="truncate">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

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

      <style jsx global>{`
        @keyframes popIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}