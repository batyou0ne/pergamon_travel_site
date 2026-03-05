import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import "./TripPlanner.css";

const STATUS_COLORS = {
    PLANNED: { bg: "rgba(0,180,216,0.12)", color: "#48cae4", label: "Planned" },
    ONGOING: { bg: "rgba(244,162,97,0.12)", color: "#f4a261", label: "Ongoing" },
    COMPLETED: { bg: "rgba(76,175,80,0.12)", color: "#81c784", label: "Completed" },
    CANCELLED: { bg: "rgba(230,57,70,0.1)", color: "#e57373", label: "Cancelled" },
};

const TripPlanner = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/trips")
            .then((res) => setTrips(res.data.data.trips))
            .catch(() => setError("Failed to load trips."))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this trip?")) return;
        try {
            await api.delete(`/trips/${id}`);
            setTrips((prev) => prev.filter((t) => t.id !== id));
        } catch {
            setError("Failed to delete trip.");
        }
    };

    return (
        <main className="page trips">
            <div className="container">
                <div className="trips__header">
                    <div>
                        <span className="badge badge-teal">🗺️ My Adventures</span>
                        <h1 className="section-title" style={{ marginTop: "12px" }}>
                            My <span className="gradient-text">Trip Planner</span>
                        </h1>
                        <p className="section-subtitle">Organize all your adventures in one place.</p>
                    </div>
                    <Link to="/destinations" className="btn btn-gold">
                        + Plan New Trip
                    </Link>
                </div>

                {loading && <div className="spinner" />}
                {error && <div className="trips__error">{error}</div>}

                {!loading && trips.length === 0 && (
                    <div className="trips__empty card">
                        <div style={{ fontSize: "4rem" }}>🌍</div>
                        <h3>No trips planned yet</h3>
                        <p>Browse destinations and start planning your dream adventure!</p>
                        <Link to="/destinations" className="btn btn-primary" style={{ marginTop: "16px" }}>
                            Explore Destinations
                        </Link>
                    </div>
                )}

                {!loading && trips.length > 0 && (
                    <>
                        {/* Stats row */}
                        <div className="trips__stats">
                            {Object.entries(STATUS_COLORS).map(([status, cfg]) => {
                                const count = trips.filter((t) => t.status === status).length;
                                return (
                                    <div key={status} className="trips__stat glass">
                                        <div className="trips__stat-count" style={{ color: cfg.color }}>{count}</div>
                                        <div className="trips__stat-label">{cfg.label}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="trips__list">
                            {trips.map((trip, i) => {
                                const status = STATUS_COLORS[trip.status] || STATUS_COLORS.PLANNED;
                                return (
                                    <article
                                        key={trip.id}
                                        className="trip-card card animate-fade-up"
                                        style={{ animationDelay: `${i * 0.08}s` }}
                                    >
                                        <div className="trip-card__icon">🗺️</div>
                                        <div className="trip-card__body">
                                            <div className="trip-card__meta">
                                                <span
                                                    className="badge"
                                                    style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}33` }}
                                                >
                                                    {status.label}
                                                </span>
                                                {trip.destination && (
                                                    <span className="trip-card__dest">
                                                        📍 {trip.destination.name}, {trip.destination.country}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="trip-card__title">{trip.title}</h3>
                                            {(trip.startDate || trip.endDate) && (
                                                <div className="trip-card__dates">
                                                    📅 {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "TBD"}
                                                    {" → "}
                                                    {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "TBD"}
                                                </div>
                                            )}
                                            {trip.notes && (
                                                <p className="trip-card__notes">{trip.notes}</p>
                                            )}
                                        </div>
                                        <div className="trip-card__actions">
                                            <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
                                                Edit
                                            </button>
                                            <button
                                                className="btn"
                                                style={{ padding: "8px 16px", fontSize: "0.8rem", color: "#e57373", border: "1.5px solid rgba(230,57,70,0.4)", background: "rgba(230,57,70,0.08)", borderRadius: "8px" }}
                                                onClick={() => handleDelete(trip.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default TripPlanner;
