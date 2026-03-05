import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./CreatePost.css";

const CreatePost = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form State
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [caption, setCaption] = useState("");

    // Location Search State
    const [locationInput, setLocationInput] = useState("");
    const [locationResults, setLocationResults] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [selectedLocationName, setSelectedLocationName] = useState("");
    const debounceTimer = useRef(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // ─── Location Autocomplete Effect ──────────────────────────────────────────
    useEffect(() => {
        if (locationInput.length >= 3 && locationInput !== selectedLocationName) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(fetchLocations, 500);
        } else if (locationInput.length < 3) {
            setLocationResults([]);
        }
    }, [locationInput, selectedLocationName]);

    const fetchLocations = async () => {
        if (locationInput.length < 2) return;
        setLoadingLocation(true);
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(locationInput)}&layer=city&lang=en&limit=5`);
            const data = await response.json();
            const results = data.features.map(f => {
                const { name, state, country } = f.properties;
                return [name, state, country].filter(Boolean).join(", ");
            });
            setLocationResults(results);
        } catch (err) {
            console.error("Locations fetch error:", err);
            setLocationResults([]);
        } finally {
            setLoadingLocation(false);
        }
    };

    const handleLocationSelect = (loc) => {
        setLocationInput(loc);
        setSelectedLocationName(loc);
        setLocationResults([]);
    };

    // ─── Step 1: Handle Image Selection ────────────────────────────────────────

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a preview URL
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        // Convert to Base64 for the backend
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result);
            setStep(2); // Move to compose step
        };
        reader.readAsDataURL(file);
    };

    // ─── Step 3: Handle Post Creation ──────────────────────────────────────────

    const submitPost = async (locationData = null) => {
        try {
            setLoading(true);
            setError("");

            const payload = {
                imageUrl: imageBase64,
                caption,
                locationName: selectedLocationName || locationInput // fallback to what they typed if not clicked
            };

            if (locationData && locationData.latitude && locationData.longitude) {
                payload.latitude = locationData.latitude;
                payload.longitude = locationData.longitude;
            }

            const response = await api.post("/posts", payload);

            // Check if they earned any badges
            const earnedBadges = response.data?.data?.earnedBadges;
            if (earnedBadges && earnedBadges.length > 0) {
                // We will navigate to profile with a state parameter to show a congratulatory toast
                navigate("/profile", { state: { newBadges: earnedBadges } });
            } else {
                navigate("/"); // Back to feed
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create post. Please try again.");
            setLoading(false);
        }
    };

    const handleVerifyLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                submitPost({ latitude, longitude });
            },
            (err) => {
                console.error("Geo error:", err);
                setError("Could not get your location. Please check your permissions.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSkipVerification = () => {
        submitPost(null);
    };

    // ─── Render Steps ──────────────────────────────────────────────────────────

    return (
        <main className="create-post-container">
            {/* Header */}
            <header className="create-post-header">
                <button className="btn-icon" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
                    ✕
                </button>
                <h2>{step === 1 ? "New Post" : step === 2 ? "Compose" : "Location"}</h2>
                <div style={{ width: "40px" }} /> {/* Spacer */}
            </header>

            <div className="create-post-content">
                {error && <div className="create-post-error">{error}</div>}

                {/* Step 1: Source Selection */}
                {step === 1 && (
                    <div className="source-selection animate-fade-up">
                        <div className="source-btn-group">
                            <button className="source-btn primary" onClick={() => cameraInputRef.current.click()}>
                                <span className="source-icon">📸</span>
                                Take a Photo
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                ref={cameraInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileSelect}
                            />

                            <div className="divider"><span>OR</span></div>

                            <button className="source-btn secondary" onClick={() => fileInputRef.current.click()}>
                                <span className="source-icon">🖼️</span>
                                Choose from Gallery
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileSelect}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Compose */}
                {step === 2 && (
                    <div className="compose-section animate-fade-up">
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                        <div className="caption-input">
                            <textarea
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="location-input-wrapper" style={{ position: 'relative', marginBottom: '16px' }}>
                            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color)', borderRadius: 'var(--radius-full)', padding: '8px 16px', border: '1px solid var(--border-color)' }}>
                                <MapPin size={18} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
                                <input
                                    type="text"
                                    placeholder="Where is this? (e.g. Colosseum, Rome)"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
                                />
                                {loadingLocation && <span className="spinner-loader" style={{ width: '16px', height: '16px', borderTopColor: 'var(--accent-primary)' }}></span>}
                            </div>

                            {locationResults.length > 0 && (
                                <div className="dropdown-results" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginTop: '4px', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>
                                    {locationResults.map((loc, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleLocationSelect(loc)}
                                            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: i < locationResults.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                                        >
                                            <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                                            <span>{loc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="btn btn-primary w-full next-btn" onClick={() => setStep(3)}>
                            Next →
                        </button>
                    </div>
                )}

                {/* Step 3: Location Verification */}
                {step === 3 && (
                    <div className="location-section animate-fade-up">
                        <div className="location-hero">🗺️</div>
                        <h3 className="location-title">Verify Your Location?</h3>
                        <p className="location-desc">
                            Share your location to prove you're actually here!
                            You might even discover a hidden <strong>Easter Egg Badge</strong> for certain famous landmarks.
                        </p>

                        <div className="location-actions">
                            <button
                                className="btn btn-primary w-full verify-btn"
                                onClick={handleVerifyLocation}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "📍 Yes, Verify Location"}
                            </button>
                            <button
                                className="btn btn-outline w-full skip-btn"
                                onClick={handleSkipVerification}
                                disabled={loading}
                            >
                                No, Just Post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default CreatePost;
