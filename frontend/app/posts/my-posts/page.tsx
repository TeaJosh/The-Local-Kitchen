"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useNsfwCheck } from "@/hooks/use-nsfw-check";
import { FaXmark } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import {
  FaUserCog,
  FaUser,
  FaLock,
  FaEnvelope,
  FaAddressBook,
  FaCreditCard,
  FaHistory,
  FaBookmark,
} from "react-icons/fa";

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
  is_draft?: boolean;
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
const POSTS_PER_PAGE = 9;

const CUISINE_FILTER_OPTIONS = ["All", ...CUISINES];
const OCCASION_FILTER_OPTIONS = ["All", "Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Family-Friendly"] as const;
const VIBE_FILTER_OPTIONS = ["All", "Cozy", "Lively", "Modern"] as const;

const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();

const SIDEBAR_ITEMS = [
  { href: "/account/settings/account", icon: <FaUserCog />, label: "Account" },
  { href: "/account/settings/profile", icon: <FaUser />, label: "Profile" },
  { href: "/account/settings/privacy", icon: <FaLock />, label: "Privacy" },
  { href: "/account/settings/notifications", icon: <FaEnvelope />, label: "Notifications" },
  { href: "/account/settings/address", icon: <FaAddressBook />, label: "Address" },
  { href: "/account/settings/payment-methods", icon: <FaCreditCard />, label: "Payment Methods" },
  { href: "/account/settings/order-history", icon: <FaHistory />, label: "Order History" },
  { href: "/account/settings/saved-posts", icon: <FaBookmark />, label: "Saved Posts" },
];

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

const filterPillStyle = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  border: active ? "1px solid #111" : "1px solid #ddd",
  background: active ? "#111" : "#f5f5f5",
  color: active ? "#fff" : "#444",
  fontSize: "11px",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
});

export default function MyPosts() {
  const pathname = usePathname();

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

  const [search, setSearch] = useState("");
  const [filterCuisine, setFilterCuisine] = useState<string>("All");
  const [filterOccasion, setFilterOccasion] = useState<string>("All");
  const [filterVibe, setFilterVibe] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"Recent" | "Oldest">("Recent");
  const [filterCuisineOpen, setFilterCuisineOpen] = useState(false);
  const [filterOccasionOpen, setFilterOccasionOpen] = useState(false);
  const [filterVibeOpen, setFilterVibeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterCuisineRef = useRef<HTMLDivElement>(null);
  const filterOccasionRef = useRef<HTMLDivElement>(null);
  const filterVibeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
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
      // FIX: previously this only filtered by author, so a post you'd
      // moved to draft (is_draft: true, still living on the backend under
      // your account) would come right back into My Posts on the next
      // fetch/reload even though it had been removed from local state.
      // My Posts should only ever show published posts — drafts belong on
      // the Saved Posts page.
      const filtered = allPosts.filter(
        (post) => post.author === user.username && !post.is_draft
      );
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

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (filterCuisineRef.current && !filterCuisineRef.current.contains(target)) setFilterCuisineOpen(false);
      if (filterOccasionRef.current && !filterOccasionRef.current.contains(target)) setFilterOccasionOpen(false);
      if (filterVibeRef.current && !filterVibeRef.current.contains(target)) setFilterVibeOpen(false);
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCuisine, filterOccasion, filterVibe]);

  const filteredCuisines = useMemo(
    () => CUISINES.filter((c) => c.toLowerCase().includes(cuisineSearch.toLowerCase())),
    [cuisineSearch]
  );

  const filteredPosts = useMemo(() => {
    const q = norm(search);

    const matched = myPosts.filter((post) => {
      const matchesSearch =
        !q ||
        norm(post.title).includes(q) ||
        norm(post.subheading).includes(q) ||
        norm(post.city).includes(q) ||
        norm(post.state).includes(q) ||
        norm(post.cuisine).includes(q) ||
        norm(post.occasion).includes(q) ||
        norm(post.vibe).includes(q) ||
        norm(post.section).includes(q);

      const matchesCuisine = norm(filterCuisine) === "all" || norm(post.cuisine) === norm(filterCuisine);
      const matchesOccasion = norm(filterOccasion) === "all" || norm(post.occasion) === norm(filterOccasion);
      const matchesVibe = norm(filterVibe) === "all" || norm(post.vibe) === norm(filterVibe);
      return matchesSearch && matchesCuisine && matchesOccasion && matchesVibe;
    });

    return [...matched].sort((a, b) => {
      const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortBy === "Recent" ? bd - ad : ad - bd;
    });
  }, [myPosts, search, filterCuisine, filterOccasion, filterVibe, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

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

  // Publishes the post. Explicitly sends is_draft: false so that a post
  // previously moved to draft (via handleSaveAsDraft below) gets flipped
  // back to published when you hit Save again.
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
          is_draft: false,
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
                is_draft: false,
              }
            : p
        )
      );

      closeEdit();
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  // Save as Draft is always available, even when the post already fulfills
  // every publish requirement (title/section/content length) — the whole
  // point is to be able to pull an already-published post back into draft
  // state whenever you want, with no validation blocking it.
  //
  // This PUTs to the same update endpoint handleSave uses, just with
  // is_draft: true. The post keeps its id and content — it's flagged
  // unpublished, not deleted — and hitting Save again later (which sends
  // is_draft: false) republishes it exactly where it left off.
  //
  // Saved Posts reads its list from a `drafts_${username}` localStorage
  // array rather than fetching drafts from the API, so this also writes a
  // full mirror entry there so the post shows up on Saved Posts right away
  // with its thumbnail and content intact.
  //
  // FIX: this previously wrote a stripped-down entry (id/title/heading/
  // savedAt/cuisine/occasion/vibe/author only) with no `image`, `content`,
  // `city`, `state`, `section`, `comments`, or `privacy` — which is why
  // Saved Posts showed no thumbnail and opening a draft showed no content.
  // Now the full form state is mirrored. Because storing the full base64
  // image can occasionally blow past localStorage's ~5-10MB per-origin
  // quota on photo-heavy accounts, the write is attempted with the image
  // first and only falls back to dropping image data (starting with older
  // entries, then this entry) if the browser actually throws
  // QuotaExceededError — so the common case keeps the thumbnail, and only
  // the quota edge case degrades gracefully instead of failing outright.
  const handleSaveAsDraft = async () => {
    if (!editingPost) return;
    if (!editor) return alert("Content editor is not ready.");

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
          section: selectedSection
            ? mapSectionToApi(selectedSection)
            : mapSectionToApi(editingPost.section),
          cuisine: selectedCuisine ? mapCuisineToApi(selectedCuisine) : "",
          occasion: selectedOccasion ? mapOccasionToApi(selectedOccasion) : "",
          vibe: selectedVibe ? mapVibeToApi(selectedVibe) : "",
          city: editingPost.city,
          state: editingPost.state,
          content: editor.getHTML(),
          allow_comments: comments === "1",
          is_anonymous: privacy === "1",
          is_draft: true,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to save post as draft");

      // The backend PUT above is the authoritative save — the post is
      // already flagged is_draft: true at this point, regardless of what
      // happens below. Everything past this line is a best-effort mirror
      // for Saved Posts, wrapped in its own try/catch so it can never mask
      // or block a save that already succeeded.
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const username = user.username;

        const resolvedSection = selectedSection || editingPost.section;

        const fullDraft = {
          id: editingPost.id,
          title: editingPost.title,
          heading: editingPost.subheading,
          image: imgSrc || "",
          savedAt: new Date().toISOString(),
          cuisine: selectedCuisine || "",
          occasion: selectedOccasion || "",
          vibe: selectedVibe || "",
          author: username || "",
          content: editor.getHTML(),
          city: editingPost.city,
          state: editingPost.state,
          section: resolvedSection,
          comments,
          privacy,
        };

        const existingDrafts: Array<Record<string, unknown> & { id: string }> = JSON.parse(
          localStorage.getItem(`drafts_${username}`) || "[]"
        );
        const withoutThisId = existingDrafts.filter((d) => d.id !== fullDraft.id);

        const writeDrafts = (drafts: unknown[]) => {
          localStorage.setItem(`drafts_${username}`, JSON.stringify(drafts));
        };

        try {
          // Attempt 1: keep every entry's image, including this one.
          writeDrafts([...withoutThisId, fullDraft]);
        } catch (quotaErr) {
          console.warn("Draft mirror hit storage quota, dropping older thumbnails and retrying:", quotaErr);
          try {
            // Attempt 2: drop images from older drafts, keep this one's.
            const olderWithoutImages = withoutThisId.map(({ image, ...rest }) => rest);
            writeDrafts([...olderWithoutImages, fullDraft]);
          } catch (quotaErr2) {
            console.warn("Still over quota, dropping this draft's thumbnail too:", quotaErr2);
            // Attempt 3: last resort — drop this draft's image too, but
            // keep everything else (content, city, state, section, etc.)
            const { image, ...draftWithoutImage } = fullDraft;
            const olderWithoutImages = withoutThisId.map(({ image: _img, ...rest }) => rest);
            writeDrafts([...olderWithoutImages, draftWithoutImage]);
          }
        }
      } catch (mirrorErr) {
        console.error("Draft saved on the server, but the local Saved Posts mirror failed:", mirrorErr);
      }

      setMyPosts((prev) => prev.filter((p) => p.id !== editingPost.id));
      closeEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save post as draft");
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

  const handleCardDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to delete");

      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      window.location.reload();
    } catch {
      alert("Failed to delete post");
    }
  };

  const FilterDropdown = ({
    label,
    value,
    open,
    setOpen,
    options,
    refObj,
    onSelect,
  }: {
    label: string;
    value: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    options: readonly string[];
    refObj: React.RefObject<HTMLDivElement | null>;
    onSelect: (v: string) => void;
  }) => (
    <div ref={refObj} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border border-gray-300 rounded-xl bg-white text-sm"
        style={{ gap: "10px", minWidth: "170px", padding: "10px 12px" }}
      >
        <span>{label}: {value}</span>
        <span>▾</span>
      </button>
      {open && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto"
          style={{ top: "calc(100% + 6px)", left: 0, minWidth: "220px", maxHeight: "280px", padding: "6px" }}
        >
          {options.map((opt) => {
            const active = norm(value) === norm(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-lg text-sm hover:bg-gray-100 ${active ? "font-bold bg-gray-100" : "font-normal bg-white"}`}
                style={{ padding: "10px 12px" }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside
        className="flex flex-col w-64 h-screen overflow-y-auto bg-white border-r border-gray-200"
        style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px" }}
      >
        <nav className="flex flex-col gap-1" style={{ marginTop: "24px" }}>
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${active ? "bg-gray-100 text-orange-500" : "text-gray-700"}`}
                style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col items-center" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="w-full max-w-7xl flex justify-center" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <h1 className="text-3xl font-bold">My Posts</h1>
        </div>

        <div className="w-full max-w-7xl" style={{ marginBottom: "12px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your posts..."
            className="w-full border border-gray-300 rounded-xl text-sm"
            style={{ padding: "10px 12px" }}
          />
        </div>

        <div className="w-full max-w-7xl flex flex-wrap justify-between items-start" style={{ gap: "12px", marginBottom: "24px" }}>
          <div className="flex flex-wrap items-center" style={{ gap: "12px" }}>
            <FilterDropdown label="Cuisine" value={filterCuisine} open={filterCuisineOpen} setOpen={setFilterCuisineOpen} options={CUISINE_FILTER_OPTIONS} refObj={filterCuisineRef} onSelect={setFilterCuisine} />
            <FilterDropdown label="Occasion" value={filterOccasion} open={filterOccasionOpen} setOpen={setFilterOccasionOpen} options={OCCASION_FILTER_OPTIONS} refObj={filterOccasionRef} onSelect={setFilterOccasion} />
            <FilterDropdown label="Vibe" value={filterVibe} open={filterVibeOpen} setOpen={setFilterVibeOpen} options={VIBE_FILTER_OPTIONS} refObj={filterVibeRef} onSelect={setFilterVibe} />

            {(filterCuisine !== "All" || filterOccasion !== "All" || filterVibe !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setFilterCuisine("All");
                  setFilterOccasion("All");
                  setFilterVibe("All");
                }}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 underline"
              >
                Reset filters
              </button>
            )}
          </div>

          <FilterDropdown label="Sort" value={sortBy} open={sortOpen} setOpen={setSortOpen} options={["Recent", "Oldest"]} refObj={sortRef} onSelect={(v) => setSortBy(v as "Recent" | "Oldest")} />
        </div>

        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch" style={{ gap: "32px" }}>
            {paginatedPosts.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">No posts found.</p>
            )}

            {paginatedPosts.map((post) => (
              <div key={post.id} className="w-full max-w-md flex flex-col" style={{ height: "100%" }}>
                <Link href={`/posts/${post.id}`} className="flex flex-col flex-1">
                  <div className="flex flex-col items-center text-center flex-1">
                    {post.image && (
                      <Image
                        src={post.image}
                        width={500}
                        height={350}
                        alt="Blog card image"
                        className="w-full h-64 object-cover rounded-lg"
                        style={{ marginBottom: "16px" }}
                      />
                    )}

                    <div className="flex flex-wrap justify-center" style={{ gap: "8px", marginBottom: "12px" }}>
                      {post.cuisine && (
                        <span style={filterPillStyle(norm(filterCuisine) === norm(post.cuisine))}>{post.cuisine}</span>
                      )}
                      {post.occasion && (
                        <span style={filterPillStyle(norm(filterOccasion) === norm(post.occasion))}>{post.occasion}</span>
                      )}
                      {post.vibe && (
                        <span style={filterPillStyle(norm(filterVibe) === norm(post.vibe))}>{post.vibe}</span>
                      )}
                    </div>

                    <h2
                      className="text-3xl font-bold"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        lineHeight: "36px",
                        height: "72px",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-gray-500"
                      style={{
                        marginTop: "8px",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        lineHeight: "24px",
                        height: "72px",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.subheading}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500 w-full" style={{ marginTop: "auto", paddingTop: "16px" }}>
                      <span>By {post.author}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="w-full text-center bg-black text-white rounded-md hover:bg-gray-800"
                  style={{ marginTop: "16px", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {filteredPosts.length > 0 && totalPages > 1 && (
            <div className="w-full flex items-center justify-center flex-wrap" style={{ gap: "8px", marginTop: "40px" }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ padding: "8px 14px" }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`rounded-md text-sm border ${
                    currentPage === pageNum
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  style={{ padding: "8px 14px" }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ padding: "8px 14px" }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
            <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-gray-200 shadow-2xl animate-[popIn_180ms_ease-out] max-h-[90vh] overflow-y-auto">
              <div className="min-h-screen flex items-center justify-center" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "64px", paddingBottom: "64px" }}>
                <button
                  onClick={closeEdit}
                  className="absolute top-6 left-6 inline-flex items-center text-gray-500 hover:text-gray-800 transition"
                  style={{ gap: "4px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span className="font-bold text-base" style={{ marginLeft: "4px" }}>Cancel</span>
                </button>

                <div className="w-full max-w-5xl border border-gray-200 rounded-2xl bg-white" style={{ margin: "32px", padding: "32px" }}>
                  <div className="flex flex-col" style={{ gap: "8px" }}>
                    <div className="flex flex-col" style={{ gap: "4px" }}>
                      <label className="text-base font-semibold text-gray-500">Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full border border-gray-300 rounded text-base"
                        style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                      />
                    </div>

                    <div className="flex flex-col" style={{ gap: "4px" }}>
                      <label className="text-base font-semibold text-gray-500">Subheading</label>
                      <input
                        type="text"
                        value={editingPost.subheading}
                        onChange={(e) => setEditingPost({ ...editingPost, subheading: e.target.value })}
                        className="w-full border border-gray-300 rounded text-base"
                        style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                      />
                    </div>

                    <div className="flex flex-col" style={{ gap: "4px" }}>
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
                            className="absolute top-2 right-2 bg-white text-gray-700 rounded-full text-medium shadow hover:bg-gray-100"
                            style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "4px", paddingBottom: "4px" }}
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
                          <div className="flex flex-col items-center justify-center text-body" style={{ paddingTop: "20px", paddingBottom: "24px" }}>
                            <p className="text-sm" style={{ marginBottom: "8px" }}>
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

                    <div className="flex flex-col" style={{ gap: "4px" }}>
                      <label className="text-base font-semibold text-gray-500">Content</label>
                      <div className="w-full border rounded-lg overflow-y-auto h-[500px]">
                        <SimpleEditor
                          key={editingPost.id}
                          onEditorReady={(ed) => {
                            setEditor(ed);
                          }}
                        />
                      </div>
                      <p className={`text-xs ${charCount < CONTENT_MIN || charCount > CONTENT_MAX ? "text-red-500" : "text-green-500"}`} style={{ marginTop: "4px" }}>
                        {charCount} / {CONTENT_MAX} characters
                        {charCount < CONTENT_MIN && ` (minimum ${CONTENT_MIN})`}
                        {charCount > CONTENT_MAX && ` (over limit by ${charCount - CONTENT_MAX})`}
                      </p>
                    </div>

                    <div className="flex" style={{ gap: "16px" }}>
                      <div className="flex flex-col flex-1" style={{ gap: "4px" }}>
                        <label className="text-base font-semibold text-gray-500">City</label>
                        <input
                          type="text"
                          value={editingPost.city}
                          onChange={(e) => setEditingPost({ ...editingPost, city: e.target.value })}
                          className="w-full border border-gray-300 rounded text-base"
                          style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                        />
                      </div>
                      <div className="flex flex-col flex-1" style={{ gap: "4px" }}>
                        <label className="text-base font-semibold text-gray-500">State</label>
                        <input
                          type="text"
                          value={editingPost.state}
                          onChange={(e) => setEditingPost({ ...editingPost, state: e.target.value })}
                          className="w-full border border-gray-300 rounded text-base"
                          style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                        />
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col" style={{ gap: "8px" }}>
                      <label className="text-base font-semibold text-gray-500">Comments</label>
                      <div className="flex" style={{ gap: "32px" }}>
                        <label className="flex items-center" style={{ gap: "8px" }}>
                          <input type="radio" name="comments" value="1" checked={comments === "1"} onChange={(e) => setComments(e.target.value)} />
                          Allow comments
                        </label>
                        <label className="flex items-center" style={{ gap: "8px" }}>
                          <input type="radio" name="comments" value="2" checked={comments === "2"} onChange={(e) => setComments(e.target.value)} />
                          Disable comments
                        </label>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col" style={{ gap: "8px" }}>
                      <label className="text-base font-semibold text-gray-500">Author Privacy</label>
                      <div className="flex" style={{ gap: "32px" }}>
                        <label className="flex items-center" style={{ gap: "8px" }}>
                          <input type="radio" name="privacy" value="1" checked={privacy === "1"} onChange={(e) => setPrivacy(e.target.value)} />
                          Change name to Anonymous
                        </label>
                        <label className="flex items-center" style={{ gap: "8px" }}>
                          <input type="radio" name="privacy" value="2" checked={privacy === "2"} onChange={(e) => setPrivacy(e.target.value)} />
                          Don't change name to Anonymous
                        </label>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col" style={{ gap: "8px" }}>
                      <label className="text-base font-semibold text-gray-500">Section</label>
                      <p className="text-xs text-gray-400">
                        Choose where this post appears on the blog page. Selecting "No Preference"
                        will place your post in Latest Posts and More Posts automatically.
                      </p>
                      <div className="flex flex-wrap" style={{ gap: "12px" }}>
                        {SECTIONS.map((section) => (
                          <button
                            key={section}
                            type="button"
                            onClick={() => setSelectedSection((prev) => (prev === section ? null : section))}
                            className={`rounded-full border text-sm font-medium transition-all
                              ${selectedSection === section
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                              }`}
                            style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                          >
                            {section}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col relative" style={{ gap: "8px" }}>
                      <label className="text-base font-semibold text-gray-500">Tags</label>

                      <div className="relative flex justify-left">
                        <button
                          type="button"
                          onClick={() => setOpen((prev) => !prev)}
                          className="flex items-center rounded-md bg-white text-sm font-semibold shadow border"
                          style={{ gap: "4px", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                        >
                          Options
                        </button>

                        {open && (
                          <div className="absolute top-full w-56 bg-white border rounded-md shadow z-[70]" style={{ marginTop: "8px" }}>
                            <button
                              type="button"
                              className="flex justify-between items-center w-full text-left text-sm hover:bg-gray-100"
                              style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
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
                                className="flex justify-between items-center w-full text-sm hover:bg-gray-100"
                                style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                              >
                                <span>All Vibes</span>
                                {selectedVibe && <span className="text-xs text-blue-600 font-semibold">(1)</span>}
                              </button>

                              {subOpen === "vibes" && (
                                <div className="absolute left-full top-0 w-48 bg-white border rounded-md shadow z-[80]" style={{ marginLeft: "4px" }}>
                                  {["Cozy", "Lively", "Modern"].map((tag) => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => setSelectedVibe((prev) => (prev === tag ? null : tag))}
                                      className={`flex items-center w-full text-left text-sm hover:bg-gray-100 ${selectedVibe === tag ? "font-semibold text-blue-600" : ""}`}
                                      style={{ gap: "8px", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
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
                                className="flex justify-between items-center w-full text-sm hover:bg-gray-100"
                                style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                              >
                                <span>All Occasions</span>
                                {selectedOccasion && <span className="text-xs text-blue-600 font-semibold">(1)</span>}
                              </button>

                              {subOpen === "occasions" && (
                                <div className="absolute left-full top-0 w-48 bg-white border rounded-md shadow z-[80]" style={{ marginLeft: "4px" }}>
                                  {["Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Family-Friendly"].map((tag) => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => setSelectedOccasion((prev) => (prev === tag ? null : tag))}
                                      className={`flex items-center w-full text-left text-sm hover:bg-gray-100 ${selectedOccasion === tag ? "font-semibold text-blue-600" : ""}`}
                                      style={{ gap: "8px", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
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
                        <div className="flex flex-wrap" style={{ gap: "8px", marginTop: "4px" }}>
                          {selectedVibe && (
                            <span style={filterPillStyle(true)}>
                              {selectedVibe}
                              <button type="button" onClick={() => setSelectedVibe(null)} style={{ marginLeft: "6px" }}>×</button>
                            </span>
                          )}
                          {selectedCuisine && (
                            <span style={filterPillStyle(true)}>
                              {selectedCuisine}
                              <button type="button" onClick={() => setSelectedCuisine(null)} style={{ marginLeft: "6px" }}>×</button>
                            </span>
                          )}
                          {selectedOccasion && (
                            <span style={filterPillStyle(true)}>
                              {selectedOccasion}
                              <button type="button" onClick={() => setSelectedOccasion(null)} style={{ marginLeft: "6px" }}>×</button>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex" style={{ gap: "16px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || charCount < CONTENT_MIN || charCount > CONTENT_MAX}
                        className="bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveAsDraft}
                        disabled={saving}
                        title="Unpublish this post and move it back to Saved Posts as a draft"
                        className="bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        {saving ? "Saving..." : "Save as Draft"}
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        Delete
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
              <div className="flex items-center justify-between border-b" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "8px" }}>
                <span className="text-base font-semibold">Cuisines</span>
                <button
                  type="button"
                  onClick={() => setCuisineOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="border-b" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="Search"
                  value={cuisineSearch}
                  onChange={(e) => setCuisineSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded text-sm"
                  style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px" }}
                />
              </div>

              <div className="overflow-y-auto flex-1" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}>
                <div className="grid grid-cols-3" style={{ columnGap: "8px", rowGap: "8px" }}>
                  {filteredCuisines.map((cuisine) => (
                    <label key={cuisine} className="flex items-center text-xs cursor-pointer" style={{ gap: "6px" }}>
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

              <div className="flex items-center justify-between border-t" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}>
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
                  className="bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                  style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "8px", paddingBottom: "8px" }}
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
    </div>
  );
}
