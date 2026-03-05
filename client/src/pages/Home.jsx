import { Link } from "react-router-dom";
import "./Home.css";

const FEATURED = [];

const CATEGORIES = [
    { label: "Beach", icon: "🏖️", color: "#00b4d8" },
    { label: "Mountain", icon: "⛰️", color: "#7c9885" },
    { label: "City", icon: "🌆", color: "#9b5de5" },
    { label: "Cultural", icon: "🏛️", color: "#f4a261" },
    { label: "Adventure", icon: "🪂", color: "#e63946" },
    { label: "Luxury", icon: "💎", color: "#ffd700" },
    { label: "Nature", icon: "🌿", color: "#4caf50" },
    { label: "Food", icon: "🍜", color: "#ff6b6b" },
];

const renderStars = (rating) => "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

const Home = () => (
    <main className="home">
        {/* ── Hero ── */}
        <section className="hero">
            <div className="hero__bg" />
            <div className="hero__particles">
                {[...Array(20)].map((_, i) => (
                    <span key={i} className="particle" style={{ "--i": i }} />
                ))}
            </div>
            <div className="container hero__content animate-fade-up">
                <span className="badge badge-teal" style={{ marginBottom: "20px" }}>✈ Discover the World</span>
                <h1 className="hero__title">
                    <span>Your Next</span>
                    <br />
                    <span className="gradient-text">Adventure</span>
                    <br />
                    <span>Awaits</span>
                </h1>
                <p className="hero__subtitle">
                    Explore breathtaking destinations, craft unforgettable journeys,
                    and create memories that last a lifetime.
                </p>
                <div className="hero__cta">
                    <Link to="/destinations" className="btn btn-primary hero__btn">
                        Explore Destinations
                        <span>→</span>
                    </Link>
                    <Link to="/register" className="btn btn-outline hero__btn">Plan My Trip</Link>
                </div>
                {/* Search bar */}
                <div className="hero__search glass">
                    <span className="hero__search-icon">🔍</span>
                    <input type="text" placeholder="Search destinations, countries, cities..." readOnly
                        onClick={() => window.location.href = "/destinations"} />
                    <button className="btn btn-primary" style={{ padding: "10px 24px", borderRadius: "8px" }}>Search</button>
                </div>
            </div>
        </section>

        {/* ── Stats ── */}
        <section className="stats-bar glass">
            <div className="container stats-bar__inner">
                {[
                    { value: "200+", label: "Destinations" },
                    { value: "50K+", label: "Happy Travelers" },
                    { value: "180", label: "Countries" },
                    { value: "4.9★", label: "Average Rating" },
                ].map((s) => (
                    <div key={s.label} className="stat-item">
                        <div className="stat-item__value">{s.value}</div>
                        <div className="stat-item__label">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>

        {/* ── Categories ── */}
        <section className="section container">
            <div className="section-header">
                <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
                <p className="section-subtitle">Find your perfect type of adventure</p>
            </div>
            <div className="categories-grid">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.label}
                        to={`/destinations?category=${cat.label.toUpperCase()}`}
                        className="category-card card"
                        style={{ "--cat-color": cat.color }}
                    >
                        <div className="category-card__icon">{cat.icon}</div>
                        <div className="category-card__label">{cat.label}</div>
                    </Link>
                ))}
            </div>
        </section>

        {/* ── Featured ── */}
        <section className="section container">
            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h2 className="section-title">Featured <span className="gradient-text">Destinations</span></h2>
                    <p className="section-subtitle">Handpicked wonders from around the globe</p>
                </div>
                <Link to="/destinations" className="btn btn-outline" style={{ padding: "10px 20px", fontSize: "0.85rem", flexShrink: 0 }}>
                    View All →
                </Link>
            </div>
            <div className="grid-3">
                {FEATURED.length > 0 ? (
                    FEATURED.map((dest, i) => (
                        <article
                            key={dest.id}
                            className="dest-card card animate-fade-up"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            <div className="dest-card__image">
                                <span className="dest-card__emoji">{dest.emoji}</span>
                                <span className="badge badge-gold" style={{ position: "absolute", top: "16px", right: "16px" }}>
                                    {dest.category}
                                </span>
                            </div>
                            <div className="dest-card__body">
                                <div className="dest-card__location">📍 {dest.country}</div>
                                <h3 className="dest-card__name">{dest.name}</h3>
                                <p className="dest-card__desc">{dest.desc}</p>
                                <div className="dest-card__footer">
                                    <div>
                                        <div className="stars">{renderStars(dest.rating)}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--white-dim)" }}>{dest.rating} / 5.0</div>
                                    </div>
                                    <Link to="/destinations" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
                                        Explore
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
                        <h3 className="text-h3">No Featured Destinations Yet</h3>
                        <p>Check back later for new additions!</p>
                    </div>
                )}
            </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
            <div className="container cta-section__inner glass">
                <div>
                    <h2 className="section-title">Ready to <span className="gradient-text">Wander</span>?</h2>
                    <p className="section-subtitle" style={{ marginTop: "8px" }}>
                        Join thousands of travelers planning their dream trips with Pergamon.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
                    <Link to="/register" className="btn btn-gold">Get Started — Free</Link>
                    <Link to="/destinations" className="btn btn-outline">Browse Destinations</Link>
                </div>
            </div>
        </section>
    </main>
);

export default Home;
