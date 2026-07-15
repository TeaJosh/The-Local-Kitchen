"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useNsfwCheck } from "@/hooks/use-nsfw-check";
import { FaXmark } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import Link from "next/link";
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

// Draft now carries the same fields as a published Post's edit form
// (content/city/state/section/comments/privacy), all optional, since
// older drafts saved before this change won't have them yet. Whatever
// writes drafts into localStorage (the create-post flow) should be
// updated to persist these fields too, or edited drafts will show up
// blank in the fields it doesn't set.
type Draft = {
  id: string;
  title: string;
  heading?: string;
  image?: string | null;
  savedAt: string;
  cuisine?: string | null;
  occasion?: string | null;
  vibe?: string | null;
  author?: string;
  content?: string;
  city?: string;
  state?: string;
  section?: string;
  comments?: string; // "1" = allow, "2" = disable
  privacy?: string; // "1" = anonymous, "2" = not anonymous
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

// Same mapping functions as My Posts — needed here because publishing a
// draft sends it to the same /api/posts/ endpoints that expect these
// lowercase/underscored values instead of the display labels.
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

const CUISINE_FILTER_OPTIONS = ["All", ...CUISINES];
const OCCASION_FILTER_OPTIONS = ["All", "Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Family-Friendly"] as const;
const VIBE_FILTER_OPTIONS = ["All", "Cozy", "Lively", "Modern"] as const;
const POSTS_PER_PAGE = 9;

const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();

// Sidebar nav items — matches AccountPage.tsx exactly so every settings
// page shares the same navigation.
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

// Grey pill styling, matching BlogClient / My Posts exactly.
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
  savedAt: string;
  author: string;
};

export default function SavedPostsPage() {
  const pathname = usePathname();

  const [drafts, setDrafts] = useState<Draft[]>([]);

  // --- Edit modal state, matching My Posts ---
  const [editingDraft, setEditingDraft] = useState<EditFormState | null>(null);
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

  // --- Filtering, matching My Posts ---
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

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);

  const getUsername = () => JSON.parse(localStorage.getItem("user") || "{}").username;

  useEffect(() => {
    const username = getUsername();
    const data = JSON.parse(localStorage.getItem(`drafts_${username}`) || "[]");
    setDrafts(data);
  }, []);

  useEffect(() => {
    if (!editingDraft) return;
    setImgSrc(editingDraft.image || null);
    setSelectedSection(editingDraft.section || "No Preference");
    setSelectedCuisine(editingDraft.cuisine || null);
    setSelectedOccasion(editingDraft.occasion || null);
    setSelectedVibe(editingDraft.vibe || null);
    setComments(editingDraft.comments || "1");
    setPrivacy(editingDraft.privacy || "2");
    setCharCount(0);
  }, [editingDraft]);

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
    if (!editor || !editingDraft) return;
    editor.commands.setContent(editingDraft.content || "");
    setCharCount(editor.getText().length);
  }, [editor, editingDraft]);

  // Close filter dropdowns on outside click
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

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCuisine, filterOccasion, filterVibe]);

  const filteredCuisines = useMemo(
    () => CUISINES.filter((c) => c.toLowerCase().includes(cuisineSearch.toLowerCase())),
    [cuisineSearch]
  );

  const deleteDraft = (id: string) => {
    if (!window.confirm("Delete this draft?")) return;
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    const username = getUsername();
    localStorage.setItem(`drafts_${username}`, JSON.stringify(updated));
  };

  const filteredDrafts = useMemo(() => {
    const q = norm(search);

    const matched = drafts.filter((d) => {
      const matchesSearch =
        !q ||
        norm(d.title).includes(q) ||
        norm(d.heading).includes(q) ||
        norm(d.cuisine).includes(q) ||
        norm(d.occasion).includes(q) ||
        norm(d.vibe).includes(q);

      const matchesCuisine = norm(filterCuisine) === "all" || norm(d.cuisine) === norm(filterCuisine);
      const matchesOccasion = norm(filterOccasion) === "all" || norm(d.occasion) === norm(filterOccasion);
      const matchesVibe = norm(filterVibe) === "all" || norm(d.vibe) === norm(filterVibe);
      return matchesSearch && matchesCuisine && matchesOccasion && matchesVibe;
    });

    return [...matched].sort((a, b) => {
      const ad = a.savedAt ? new Date(a.savedAt).getTime() : 0;
      const bd = b.savedAt ? new Date(b.savedAt).getTime() : 0;
      return sortBy === "Recent" ? bd - ad : ad - bd;
    });
  }, [drafts, search, filterCuisine, filterOccasion, filterVibe, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDrafts.length / POSTS_PER_PAGE));
  const paginatedDrafts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredDrafts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredDrafts, currentPage]);

  // Opens the edit modal directly from the draft already in local state —
  // no fetch needed since drafts live in localStorage, not the API.
  const openEdit = (draft: Draft) => {
    setEditingDraft({
      id: draft.id,
      title: draft.title || "",
      subheading: draft.heading || "",
      city: draft.city || "",
      state: draft.state || "",
      section: draft.section || "No Preference",
      cuisine: draft.cuisine || "",
      occasion: draft.occasion || "",
      vibe: draft.vibe || "",
      image: draft.image || "",
      content: draft.content || "",
      comments: draft.comments || "1",
      privacy: draft.privacy || "2",
      savedAt: draft.savedAt,
      author: draft.author || "",
    });
  };

  const closeEdit = () => {
    setEditingDraft(null);
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

  // Saved Posts holds unpublished/incomplete blog posts, so Save is never
  // blocked by the publish requirements (title, section, content length) —
  // it just persists whatever's currently in the form back to localStorage.
  const handleSave = async () => {
    if (!editingDraft) return;
    if (!editor) return alert("Content editor is not ready.");

    setSaving(true);
    try {
      const username = getUsername();
      const updatedDraft: Draft = {
        id: editingDraft.id,
        title: editingDraft.title,
        heading: editingDraft.subheading,
        image: imgSrc || "",
        savedAt: editingDraft.savedAt,
        cuisine: selectedCuisine || "",
        occasion: selectedOccasion || "",
        vibe: selectedVibe || "",
        author: editingDraft.author,
        content: editor.getHTML(),
        city: editingDraft.city,
        state: editingDraft.state,
        section: selectedSection || editingDraft.section,
        comments,
        privacy,
      };

      const updated = drafts.map((d) => (d.id === editingDraft.id ? updatedDraft : d));
      setDrafts(updated);
      localStorage.setItem(`drafts_${username}`, JSON.stringify(updated));

      closeEdit();
    } catch {
      alert("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Whether the draft is complete enough to publish. The Post button stays
  // visible at all times but only unlocks once all of these are true.
  const meetsPublishRequirements =
    !!editingDraft &&
    editingDraft.title.trim().length > 0 &&
    !!selectedSection &&
    charCount >= CONTENT_MIN &&
    charCount <= CONTENT_MAX;

  // Publishes the draft as a real post via the same endpoint the
  // create-post flow uses, then removes it from Saved Posts. Once
  // published, it belongs to My Posts instead — that page fetches fresh
  // from the API, so it'll show up there automatically.
  //
  // NOTE: I'm assuming a POST to /api/posts/create/ based on the naming
  // pattern of the existing update/delete endpoints in My Posts
  // (/api/posts/{id}/update/, /api/posts/{id}/delete/). If your actual
  // create-post page hits a different endpoint or expects a different
  // payload shape, swap the URL/body below to match it.
  const handlePublish = async () => {
    if (!editingDraft || !editor) return;
    if (!meetsPublishRequirements) return;

    setSaving(true);
    try {
      const username = getUsername();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editingDraft.title,
          subheading: editingDraft.subheading,
          image: imgSrc,
          section: mapSectionToApi(selectedSection as string),
          cuisine: selectedCuisine ? mapCuisineToApi(selectedCuisine) : "",
          occasion: selectedOccasion ? mapOccasionToApi(selectedOccasion) : "",
          vibe: selectedVibe ? mapVibeToApi(selectedVibe) : "",
          city: editingDraft.city,
          state: editingDraft.state,
          content: editor.getHTML(),
          allow_comments: comments === "1",
          is_anonymous: privacy === "1",
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to publish post");

      const updated = drafts.filter((d) => d.id !== editingDraft.id);
      setDrafts(updated);
      localStorage.setItem(`drafts_${username}`, JSON.stringify(updated));

      closeEdit();
    } catch {
      alert("Failed to publish post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingDraft) return;
    if (!confirm("Are you sure you want to delete this draft?")) return;

    const username = getUsername();
    const updated = drafts.filter((d) => d.id !== editingDraft.id);
    setDrafts(updated);
    localStorage.setItem(`drafts_${username}`, JSON.stringify(updated));
    closeEdit();
  };

  // Reusable filter dropdown — identical pattern to My Posts.
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
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center" style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="w-full max-w-7xl flex justify-center" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <h1 className="text-3xl font-bold">Saved Posts</h1>
        </div>

        {/* Search */}
        <div className="w-full max-w-7xl" style={{ marginBottom: "12px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your saved drafts..."
            className="w-full border border-gray-300 rounded-xl text-sm"
            style={{ padding: "10px 12px" }}
          />
        </div>

        {/* Category filters + sort */}
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
          {/* Grid — identical structure to My Posts: same columns, gap, and
              equal-height cards via items-stretch + height: 100% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch" style={{ gap: "32px" }}>
            {paginatedDrafts.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">No saved posts found.</p>
            )}

            {paginatedDrafts.map((d) => (
              <div key={d.id} className="w-full max-w-md flex flex-col" style={{ height: "100%" }}>
                <div className="flex flex-col items-center text-center flex-1">
                  {d.image && (
                    <Image
                      src={d.image}
                      width={500}
                      height={350}
                      alt="Blog card image"
                      className="w-full h-64 object-cover rounded-lg"
                      style={{ marginBottom: "16px" }}
                    />
                  )}

                  <div className="flex flex-wrap justify-center" style={{ gap: "8px", marginBottom: "12px" }}>
                    {d.cuisine && (
                      <span style={filterPillStyle(norm(filterCuisine) === norm(d.cuisine))}>{d.cuisine}</span>
                    )}
                    {d.occasion && (
                      <span style={filterPillStyle(norm(filterOccasion) === norm(d.occasion))}>{d.occasion}</span>
                    )}
                    {d.vibe && (
                      <span style={filterPillStyle(norm(filterVibe) === norm(d.vibe))}>{d.vibe}</span>
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
                    {d.title}
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
                    {d.heading}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500 w-full" style={{ marginTop: "auto", paddingTop: "16px" }}>
                    <span>{d.author ? `By ${d.author}` : "Draft"}</span>
                    <span>Saved {new Date(d.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/*
                  FIX: this used to be a <Link href={`/posts/create-post?draft=${d.id}`}>,
                  which navigated to a blank create-post page instead of opening an edit
                  modal pre-filled with the draft's content — same issue My Posts had.
                  Now it calls openEdit(d) directly (drafts already live in local state,
                  so no fetch is needed) and opens the same modal pattern as My Posts.
                */}
                <button
                  type="button"
                  onClick={() => openEdit(d)}
                  className="w-full text-center bg-black text-white rounded-md hover:bg-gray-800"
                  style={{ marginTop: "16px", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px" }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredDrafts.length > 0 && totalPages > 1 && (
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

        {/* Edit modal — same layout, fields, and behavior as My Posts, except
            Save/Delete write to localStorage instead of calling the API. */}
        {editingDraft && (
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
                        value={editingDraft.title}
                        onChange={(e) => setEditingDraft({ ...editingDraft, title: e.target.value })}
                        className="w-full border border-gray-300 rounded text-base"
                        style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                      />
                    </div>

                    <div className="flex flex-col" style={{ gap: "4px" }}>
                      <label className="text-base font-semibold text-gray-500">Subheading</label>
                      <input
                        type="text"
                        value={editingDraft.subheading}
                        onChange={(e) => setEditingDraft({ ...editingDraft, subheading: e.target.value })}
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
                          key={editingDraft.id}
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
                          value={editingDraft.city}
                          onChange={(e) => setEditingDraft({ ...editingDraft, city: e.target.value })}
                          className="w-full border border-gray-300 rounded text-base"
                          style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                        />
                      </div>
                      <div className="flex flex-col flex-1" style={{ gap: "4px" }}>
                        <label className="text-base font-semibold text-gray-500">State</label>
                        <input
                          type="text"
                          value={editingDraft.state}
                          onChange={(e) => setEditingDraft({ ...editingDraft, state: e.target.value })}
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

                    {!meetsPublishRequirements && (
                      <p className="text-xs text-gray-400">
                        To publish, you still need:{" "}
                        {[
                          !editingDraft.title.trim() && "a title",
                          !selectedSection && "a section",
                          charCount < CONTENT_MIN && `${CONTENT_MIN - charCount} more characters`,
                          charCount > CONTENT_MAX && `${charCount - CONTENT_MAX} fewer characters`,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                        .
                      </p>
                    )}

                    <div className="flex" style={{ gap: "16px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={saving || !meetsPublishRequirements}
                        title={meetsPublishRequirements ? "Publish this post" : "Complete the requirements above to unlock"}
                        className="bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        {saving ? "Posting..." : "Post"}
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

        {cuisineOpen && editingDraft && (
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
