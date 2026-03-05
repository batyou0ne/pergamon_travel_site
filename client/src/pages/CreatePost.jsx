import { useState, useRef } from "react";
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

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

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
