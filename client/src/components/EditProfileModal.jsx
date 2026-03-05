import { useState, useEffect, useRef } from "react";
import { X, Camera, MapPin, Check, Loader2 } from "lucide-react";
import api from "../lib/api";
import "./EditProfileModal.css";

const TRAVEL_STYLES = [
    "Adventure", "Culture", "Food", "Luxury", "Solo",
    "Nature", "Beach", "Hiking", "Photography", "Road Trip"
];

const POPULAR_LANGUAGES = [
    "English", "Turkish", "Spanish", "French", "German",
    "Italian", "Portuguese", "Russian", "Chinese", "Japanese",
    "Korean", "Arabic", "Dutch", "Greek", "Swedish"
];

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [dreamCity, setDreamCity] = useState(user?.dreamCity || "");
    const [selectedStyles, setSelectedStyles] = useState(
        user?.travelStyle ? user.travelStyle.split(",") : []
    );
    const [languages, setLanguages] = useState(user?.languages || "");

    // City State
    const [cityInput, setCityInput] = useState(user?.dreamCity || "");
    const [cityResults, setCityResults] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Languages State
    const [langInput, setLangInput] = useState("");
    const [langResults, setLangResults] = useState([]);

    const [isUpdating, setIsUpdating] = useState(false);

    const fileInputRef = useRef(null);
    const debounceTimer = useRef(null);

    // City Autocomplete Effect
    useEffect(() => {
        if (cityInput.length >= 3 && cityInput !== dreamCity) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(fetchCities, 500);
        } else if (cityInput.length < 3) {
            setCityResults([]);
        }
    }, [cityInput, dreamCity]);

    // Language Autocomplete Effect
    useEffect(() => {
        if (langInput.length >= 2) {
            const matches = POPULAR_LANGUAGES.filter(l =>
                l.toLowerCase().includes(langInput.toLowerCase()) &&
                !languages.toLowerCase().includes(l.toLowerCase())
            );
            setLangResults(matches);
        } else {
            setLangResults([]);
        }
    }, [langInput, languages]);

    const fetchCities = async () => {
        if (cityInput.length < 2) return;
        setLoadingCities(true);
        try {
            // Using Photon API (OpenStreetMap) - more reliable than Teleport
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(cityInput)}&layer=city&lang=en&limit=5`);
            const data = await response.json();
            const results = data.features.map(f => {
                const { name, state, country } = f.properties;
                return [name, state, country].filter(Boolean).join(", ");
            });
            setCityResults(results);
        } catch (err) {
            console.error("Cities fetch error:", err);
            setCityResults([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleCitySelect = (city) => {
        setCityInput(city);
        setDreamCity(city);
        setCityResults([]);
    };

    const handleLanguageSelect = (lang) => {
        const currentLangs = languages ? languages.split(", ").filter(l => l) : [];
        if (!currentLangs.includes(lang)) {
            const newLangs = [...currentLangs, lang].join(", ");
            setLanguages(newLangs);
        }
        setLangInput("");
        setLangResults([]);
    };

    const removeLanguage = (lang) => {
        const newLangs = languages.split(", ").filter(l => l && l !== lang).join(", ");
        setLanguages(newLangs);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleStyle = (style) => {
        setSelectedStyles(prev =>
            prev.includes(style)
                ? prev.filter(s => s !== style)
                : [...prev, style]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const data = {
                name,
                bio,
                avatar,
                dreamCity,
                travelStyle: selectedStyles.join(","),
                languages
            };
            const response = await api.patch("/auth/profile", data);
            onUpdate(response.data.data.user);
            onClose();
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update profile.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-profile-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
                <div className="edit-profile__header">
                    <h2 className="text-h2">Edit Profile</h2>
                    <button className="btn-icon" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile__content">
                    {/* ── Avatar ── */}
                    <div className="edit-profile__avatar-section">
                        <div className="edit-profile__avatar-preview" onClick={() => fileInputRef.current.click()}>
                            {avatar ? (
                                <img src={avatar} alt="Profile" />
                            ) : (
                                <div className="avatar">{user?.name?.charAt(0)}</div>
                            )}
                            <div className="edit-profile__avatar-overlay">
                                <Camera size={24} />
                            </div>
                        </div>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <span className="edit-profile__avatar-hint">Change Photo</span>
                    </div>

                    {/* ── Name ── */}
                    <div className="edit-profile__form-group">
                        <label>Public Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your display name"
                        />
                    </div>

                    {/* ── Bio ── */}
                    <div className="edit-profile__form-group">
                        <label>Biography</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Tell the world about your travels..."
                            maxLength={160}
                        />
                    </div>

                    {/* ── Next Dream City ── */}
                    <div className="edit-profile__form-group edit-profile__autocomplete-container">
                        <label>Your Next Dream Destination</label>
                        <div className="autocomplete-wrapper">
                            <input
                                type="text"
                                value={cityInput}
                                onChange={e => setCityInput(e.target.value)}
                                placeholder="Search for a city (e.g. Rome)..."
                            />
                            {loadingCities && <div className="spinner-loader"></div>}
                        </div>
                        {cityResults.length > 0 && (
                            <div className="edit-profile__results-dropdown">
                                {cityResults.map((city, i) => (
                                    <div
                                        key={i}
                                        className="result-item"
                                        onClick={() => handleCitySelect(city)}
                                    >
                                        <MapPin size={14} />
                                        <span>{city}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Travel Styles ── */}
                    <div className="edit-profile__form-group">
                        <label>Travel Style</label>
                        <div className="edit-profile__tags">
                            {TRAVEL_STYLES.map(style => (
                                <div
                                    key={style}
                                    className={`tag-badge ${selectedStyles.includes(style) ? 'active' : ''}`}
                                    onClick={() => toggleStyle(style)}
                                >
                                    {style}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Languages ── */}
                    <div className="edit-profile__form-group edit-profile__autocomplete-container">
                        <label>Languages Spoken</label>
                        <div className="edit-profile__selected-langs">
                            {languages.split(", ").filter(l => l).map(lang => (
                                <span key={lang} className="lang-tag">
                                    {lang}
                                    <X size={12} onClick={() => removeLanguage(lang)} />
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={langInput}
                            onChange={e => setLangInput(e.target.value)}
                            placeholder="Add language..."
                        />
                        {langResults.length > 0 && (
                            <div className="edit-profile__results-dropdown">
                                {langResults.map((lang, i) => (
                                    <div
                                        key={i}
                                        className="result-item"
                                        onClick={() => handleLanguageSelect(lang)}
                                    >
                                        <Check size={14} />
                                        <span>{lang}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <div className="edit-profile__footer">
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="spinner-icon" /> : <Check size={18} style={{ marginRight: 6 }} />}
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
