"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
    id?: string | number;
    title?: string;
    subheading?: string;
    city?: string;
    state?: string | null;
    cuisine?: string | null;
    occasion?: string | null;
    vibe?: string | null;
    section?: string | null;
    author?: string;
    created_at?: string;
    image?: string;
    featured?: boolean;
    is_featured?: boolean;
};

const CUISINE_OPTIONS = [
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
  "Burmese", "Kolkati", "Portuguese"
] as const;
const OCCASION_OPTIONS = ["All", "Date Night", "Fine Dining", "Group Dining", "Quick Bite", "Family-Friendly"] as const;
const VIBE_OPTIONS = ["All", "Cozy", "Lively", "Modern"] as const;
const SORT_OPTIONS = ["Recent", "Featured"] as const;

const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();

const mapOccasionToApi = (occasion: string) => {
    if (occasion === "Date Night") return "date_night";
    if (occasion === "Fine Dining") return "fine_dining";
    if (occasion === "Group Dining") return "group_dining";
    if (occasion === "Quick Bite") return "quick_bite";
    if (occasion === "Family-Friendly") return "family_friendly";
    return occasion.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
};

const normalizeOccasion = (value: unknown) => {
    const v = String(value ?? "").trim();
    if (!v) return "";
    if (v.includes("_")) return v.toLowerCase();
    return mapOccasionToApi(v);
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

export default function BlogClient({ posts = [] }: { posts: Post[] }) {
    const [search, setSearch] = useState("");
    const [cuisine, setCuisine] = useState<string>("All");
    const [occasion, setOccasion] = useState<string>("All");
    const [vibe, setVibe] = useState<string>("All");
    const [sortBy, setSortBy] = useState<"Recent" | "Featured">("Recent");

    const [cuisineOpen, setCuisineOpen] = useState(false);
    const [occasionOpen, setOccasionOpen] = useState(false);
    const [vibeOpen, setVibeOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const cuisineRef = useRef<HTMLDivElement>(null);
    const occasionRef = useRef<HTMLDivElement>(null);
    const vibeRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const safePosts = Array.isArray(posts) ? posts : [];

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (cuisineRef.current && !cuisineRef.current.contains(target)) setCuisineOpen(false);
            if (occasionRef.current && !occasionRef.current.contains(target)) setOccasionOpen(false);
            if (vibeRef.current && !vibeRef.current.contains(target)) setVibeOpen(false);
            if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false);
        };

        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const filteredPosts = useMemo(() => {
        const q = norm(search);

        const matched = safePosts.filter((post) => {
            const matchesSearch =
                !q ||
                norm(post?.title).includes(q) ||
                norm(post?.subheading).includes(q) ||
                norm(post?.city).includes(q) ||
                norm(post?.state).includes(q) ||
                norm(post?.cuisine).includes(q) ||
                norm(post?.occasion).includes(q) ||
                norm(post?.vibe).includes(q) ||
                norm(post?.section).includes(q);

            const cuisineValue = norm(cuisine);
            const matchesCuisine = cuisineValue === "all" || cuisineValue === norm(post?.cuisine);

            const occasionValue = norm(occasion);
            const matchesOccasion =
                occasionValue === "all" ||
                normalizeOccasion(post?.occasion) === mapOccasionToApi(occasion) ||
                norm(post?.occasion) === occasionValue;

            const vibeValue = norm(vibe);
            const matchesVibe = vibeValue === "all" || vibeValue === norm(post?.vibe);

            return matchesSearch && matchesCuisine && matchesOccasion && matchesVibe;
        });

        if (sortBy === "Featured") {
            return [...matched].sort(
                (a, b) =>
                    Number(Boolean(b.featured || b.is_featured)) -
                    Number(Boolean(a.featured || a.is_featured))
            );
        }

        return [...matched].sort((a, b) => {
            const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
            return bd - ad;
        });
    }, [safePosts, search, cuisine, occasion, vibe, sortBy]);

    const hasActiveFilters = norm(cuisine) !== "all" || norm(occasion) !== "all" || norm(vibe) !== "all";

    const resetFilters = () => {
        setCuisine("All");
        setOccasion("All");
        setVibe("All");
    };

    const Dropdown = ({
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
        <div ref={refObj} style={styles.dropdownWrap}>
            <button type="button" onClick={() => setOpen(!open)} style={styles.dropdownButton}>
                <span>{label}: {value}</span>
                <span>▾</span>
            </button>
            {open && (
                <div style={styles.dropdownMenu}>
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
                                style={{
                                    ...styles.dropdownItem,
                                    fontWeight: active ? 700 : 400,
                                    background: active ? "#f4f4f4" : "#fff",
                                }}
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
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.title}>Discover Stories Worth Reading</h1>
                <p style={styles.subtitle}>Search and filter posts by cuisine, occasion, and vibe.</p>
            </header>

            <div style={styles.toolbar}>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search posts..."
                    style={styles.search}
                />
            </div>

            <div style={styles.filtersBar}>
                <div style={styles.filtersRow}>
                    <Dropdown label="Cuisine" value={cuisine} open={cuisineOpen} setOpen={setCuisineOpen} options={CUISINE_OPTIONS} refObj={cuisineRef} onSelect={setCuisine} />
                    <Dropdown label="Occasion" value={occasion} open={occasionOpen} setOpen={setOccasionOpen} options={OCCASION_OPTIONS} refObj={occasionRef} onSelect={setOccasion} />
                    <Dropdown label="Vibe" value={vibe} open={vibeOpen} setOpen={setVibeOpen} options={VIBE_OPTIONS} refObj={vibeRef} onSelect={setVibe} />

                    {hasActiveFilters && (
                        <button type="button" onClick={resetFilters} style={styles.resetButton}>
                            Reset filters
                        </button>
                    )}
                </div>

                <div ref={sortRef} style={styles.dropdownWrap}>
                    <button type="button" onClick={() => setSortOpen(!sortOpen)} style={styles.dropdownButton}>
                        <span>Sort: {sortBy}</span>
                        <span>▾</span>
                    </button>
                    {sortOpen && (
                        <div style={styles.dropdownMenu}>
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        setSortBy(opt);
                                        setSortOpen(false);
                                    }}
                                    style={{
                                        ...styles.dropdownItem,
                                        fontWeight: sortBy === opt ? 700 : 400,
                                        background: sortBy === opt ? "#f4f4f4" : "#fff",
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                    width: "100%",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    alignItems: "stretch",
                }}
            >
                {filteredPosts.length === 0 ? (
                    <p style={styles.empty}>No posts found.</p>
                ) : (
                    filteredPosts.map((post) => {
                        const activeCuisine = norm(cuisine) !== "all";
                        const activeOccasion = norm(occasion) !== "all";
                        const activeVibe = norm(vibe) !== "all";
                        return (
                            <Link key={post?.id} href={`/posts/${post?.id}`} style={styles.card}>
                                <article style={styles.article}>
                                    {post?.image && (
                                        <div style={styles.imageWrapper}>
                                            <Image src={post.image} alt={post.title || "Post"} fill style={{ objectFit: "cover" }} />
                                        </div>
                                    )}
                                    <div style={styles.content}>
                                        <div style={styles.tags}>
                                            {post?.cuisine && <span style={filterPillStyle(activeCuisine)}>{post.cuisine}</span>}
                                            {post?.occasion && <span style={filterPillStyle(activeOccasion)}>{post.occasion}</span>}
                                            {post?.vibe && <span style={filterPillStyle(activeVibe)}>{post.vibe}</span>}
                                            {(post?.featured || post?.is_featured) && <span style={filterPillStyle(false)}>Featured</span>}
                                        </div>

                                        <h2 style={styles.cardTitle}>{post?.title}</h2>
                                        <p style={styles.subheading}>{post?.subheading}</p>

                                        <div style={styles.bottomRow}>
                                            <span>By {post?.author}</span>
                                            <span>{post?.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, Arial" },
    header: { marginBottom: "24px" },
    title: { fontSize: "36px", marginBottom: "6px" },
    subtitle: { color: "#666", margin: 0 },
    toolbar: { padding: "0", marginBottom: "12px", background: "#fff" },
    search: { width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "10px", fontSize: "13px" },
    filtersBar: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "20px" },
    filtersRow: { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" },
    resetButton: {
        border: "none",
        background: "none",
        color: "#666",
        fontSize: "13px",
        fontWeight: 600,
        textDecoration: "underline",
        cursor: "pointer",
        padding: "0",
    },
    dropdownWrap: { position: "relative" },
    dropdownButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        minWidth: "170px",
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        cursor: "pointer",
        fontSize: "13px",
    },
    dropdownMenu: {
        position: "absolute",
        zIndex: 50,
        top: "calc(100% + 6px)",
        left: 0,
        minWidth: "240px",
        maxHeight: "280px",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        padding: "6px",
    },
    dropdownItem: {
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        border: "none",
        background: "#fff",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "13px",
    },
    card: { textDecoration: "none", color: "inherit", display: "block", height: "100%" },
    article: {
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    imageWrapper: { position: "relative", width: "100%", height: "180px" },
    content: {
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    tags: { display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "11px", marginBottom: "8px" },
    cardTitle: {
        fontWeight: "bold",
        fontSize: "18px",
        marginBottom: "6px",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
        minHeight: "44px",
    },
    subheading: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "8px",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        overflow: "hidden",
    },
    bottomRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#999",
        marginTop: "auto",
    },
    empty: { gridColumn: "1 / -1", color: "#777" },
};
