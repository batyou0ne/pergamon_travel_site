import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import "./Destinations.css";

const CATEGORIES = ["ALL", "BEACH", "MOUNTAIN", "CITY", "CULTURAL", "ADVENTURE", "LUXURY", "NATURE", "FOOD"];
const MOCK_DESTINATIONS = [];

const renderStars = (rating) => "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

const Destinations = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "ALL");
    const [destinations, setDestinations] = useState(MOCK_DESTINATIONS);
    const [loading, setLoading] = useState(false);

    // Filter client-side (would be API in production)
    const filtered = destinations.filter((d) => {
        const matchCat = activeCategory === "ALL" || d.category === activeCategory;
        const matchSearch = !search || [d.name, d.country, d.city].some((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        );
        return matchCat && matchSearch;
    });

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setSearchParams({ category: cat, ...(search && { search }) });
    };

    return (
        <main className="page destinations">
            <div className="destinations__header">
                <div className="container">
                    <span className="badge badge-teal">🌍 Explore</span>
                    <h1 className="section-title" style={{ marginTop: "12px" }}>
                        Discover <span className="gradient-text">Places</span>
                    </h1>
                    <p className="section-subtitle">Find your perfect destination from our curated collection.</p>

                    {/* Search */}
                    <div className="destinations__search glass">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search destinations, countries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="destinations__clear">✕</button>
                        )}
                    </div>

                    {/* Category Pills */}
                    <div className="destinations__cats">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`destinations__cat-btn ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container destinations__body">
                <div className="destinations__meta">
                    <span>{filtered.length} destinations found</span>
                </div>

                {loading ? (
                    <div className="spinner" />
                ) : filtered.length === 0 ? (
                    <div className="destinations__empty">
                        <div style={{ fontSize: "4rem" }}>🗺️</div>
                        <h3>No destinations found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid-3">
                        {filtered.map((dest, i) => (
                            <article
                                key={dest.id}
                                className="dest-card card animate-fade-up"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <div className="dest-card__image">
                                    <span className="dest-card__emoji">{dest.emoji}</span>
                                    <span className="badge badge-teal" style={{ position: "absolute", top: "16px", left: "16px", fontSize: "0.7rem" }}>
                                        {dest.category}
                                    </span>
                                    <div className="dest-card__rating-badge">
                                        ⭐ {dest.rating}
                                    </div>
                                </div>
                                <div className="dest-card__body">
                                    <div className="dest-card__location">📍 {dest.city}, {dest.country}</div>
                                    <h3 className="dest-card__name">{dest.name}</h3>
                                    <div className="dest-card__footer">
                                        <div>
                                            <div className="stars" style={{ fontSize: "0.8rem" }}>{renderStars(dest.rating)}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--white-dim)" }}>
                                                {dest.reviewCount.toLocaleString()} reviews
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.8rem" }}>
                                            Details →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Destinations;
