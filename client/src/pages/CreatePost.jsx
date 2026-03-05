import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./CreatePost.css";

const TOURIST_LOCATIONS = [
    "Colosseum, Rome, Italy", "Eiffel Tower, Paris, France", "Statue of Liberty, New York, USA",
    "Great Wall, Beijing, China", "Taj Mahal, Agra, India", "Machu Picchu, Cusco, Peru",
    "Christ the Redeemer, Rio de Janeiro, Brazil", "Petra, Petra, Jordan", "Angkor Wat, Siem Reap, Cambodia",
    "Pyramids of Giza, Giza, Egypt", "Big Ben, London, United Kingdom", "Buckingham Palace, London, United Kingdom",
    "Louvre Museum, Paris, France", "Notre Dame Cathedral, Paris, France", "Sagrada Familia, Barcelona, Spain",
    "Park Güell, Barcelona, Spain", "Alhambra, Granada, Spain", "Acropolis, Athens, Greece",
    "Parthenon, Athens, Greece", "Santorini Caldera, Santorini, Greece", "Mount Fuji, Honshu, Japan",
    "Fushimi Inari Shrine, Kyoto, Japan", "Kinkaku-ji, Kyoto, Japan", "Tokyo Tower, Tokyo, Japan",
    "Shibuya Crossing, Tokyo, Japan", "Burj Khalifa, Dubai, UAE", "Palm Jumeirah, Dubai, UAE",
    "Sheikh Zayed Grand Mosque, Abu Dhabi, UAE", "Blue Mosque, Istanbul, Türkiye", "Hagia Sophia, Istanbul, Türkiye",
    "Cappadocia Fairy Chimneys, Nevşehir, Türkiye", "Pamukkale Travertines, Denizli, Türkiye", "Mount Nemrut, Adıyaman, Türkiye",
    "Stonehenge, Wiltshire, United Kingdom", "Tower Bridge, London, United Kingdom", "British Museum, London, United Kingdom",
    "Edinburgh Castle, Edinburgh, United Kingdom", "Neuschwanstein Castle, Bavaria, Germany", "Brandenburg Gate, Berlin, Germany",
    "Cologne Cathedral, Cologne, Germany", "Prague Castle, Prague, Czech Republic", "Charles Bridge, Prague, Czech Republic",
    "Schönbrunn Palace, Vienna, Austria", "Hallstatt Village, Hallstatt, Austria", "Leaning Tower of Pisa, Pisa, Italy",
    "St Peter’s Basilica, Vatican City, Vatican City", "Trevi Fountain, Rome, Italy", "Pantheon, Rome, Italy",
    "Pompeii Ruins, Pompeii, Italy", "Cinque Terre, Liguria, Italy", "Milan Cathedral, Milan, Italy",
    "Venice Grand Canal, Venice, Italy", "Doge’s Palace, Venice, Italy", "Mont Saint-Michel, Normandy, France",
    "Palace of Versailles, Versailles, France", "Arc de Triomphe, Paris, France", "Sacré-Cœur, Paris, France",
    "Disneyland Park, Anaheim, USA", "Golden Gate Bridge, San Francisco, USA", "Alcatraz Island, San Francisco, USA",
    "Grand Canyon, Arizona, USA", "Yellowstone National Park, Wyoming, USA", "Times Square, New York, USA",
    "Central Park, New York, USA", "Empire State Building, New York, USA", "Hollywood Sign, Los Angeles, USA",
    "Griffith Observatory, Los Angeles, USA", "Las Vegas Strip, Las Vegas, USA", "Niagara Falls, Ontario, Canada",
    "CN Tower, Toronto, Canada", "Banff National Park, Alberta, Canada", "Chichen Itza, Yucatán, Mexico",
    "Teotihuacan, Mexico City, Mexico", "Tulum Ruins, Tulum, Mexico", "Iguazu Falls, Iguazu, Argentina",
    "Perito Moreno Glacier, Patagonia, Argentina", "Sugarloaf Mountain, Rio de Janeiro, Brazil", "Amazon Rainforest, Amazonas, Brazil",
    "Easter Island Moai, Easter Island, Chile", "Salar de Uyuni, Uyuni, Bolivia", "Table Mountain, Cape Town, South Africa",
    "Kruger National Park, Mpumalanga, South Africa", "Victoria Falls, Livingstone, Zambia", "Serengeti National Park, Serengeti, Tanzania",
    "Mount Kilimanjaro, Kilimanjaro, Tanzania", "Pyramids of Meroe, Meroe, Sudan", "Luxor Temple, Luxor, Egypt",
    "Valley of the Kings, Luxor, Egypt", "Abu Simbel Temples, Abu Simbel, Egypt", "Wadi Rum Desert, Wadi Rum, Jordan",
    "Dead Sea, Dead Sea, Jordan", "Western Wall, Jerusalem, Israel", "Dome of the Rock, Jerusalem, Israel",
    "Masada Fortress, Masada, Israel", "Persepolis, Shiraz, Iran", "Nasir al-Mulk Mosque, Shiraz, Iran",
    "Sheikh Lotfollah Mosque, Isfahan, Iran", "Bagan Temples, Bagan, Myanmar", "Shwedagon Pagoda, Yangon, Myanmar",
    "Ha Long Bay, Quang Ninh, Vietnam", "Angkor Thom, Siem Reap, Cambodia", "Borobudur Temple, Magelang, Indonesia",
    "Prambanan Temple, Yogyakarta, Indonesia", "Komodo Island, Komodo, Indonesia", "Petronas Towers, Kuala Lumpur, Malaysia",
    "Batu Caves, Selangor, Malaysia", "Marina Bay Sands, Singapore, Singapore", "Gardens by the Bay, Singapore, Singapore",
    "Great Buddha, Hong Kong, China", "Victoria Peak, Hong Kong, China", "Forbidden City, Beijing, China",
    "Summer Palace, Beijing, China", "Terracotta Army, Xi’an, China", "Zhangjiajie National Park, Zhangjiajie, China",
    "Potala Palace, Lhasa, Tibet", "Jokhang Temple, Lhasa, Tibet", "N Seoul Tower, Seoul, South Korea",
    "Gyeongbokgung Palace, Seoul, South Korea", "Jeju Island, Jeju, South Korea", "Taipei 101, Taipei, Taiwan",
    "Sun Moon Lake, Nantou, Taiwan", "Sigiriya Rock Fortress, Sigiriya, Sri Lanka", "Temple of the Tooth, Kandy, Sri Lanka",
    "Everest Base Camp, Khumbu, Nepal", "Annapurna Circuit, Annapurna, Nepal", "Tiger’s Nest Monastery, Paro, Bhutan",
    "Thimphu Buddha Dordenma, Thimphu, Bhutan", "Red Fort, Delhi, India", "Hawa Mahal, Jaipur, India",
    "Golden Temple, Amritsar, India", "Qutub Minar, Delhi, India", "Mehrangarh Fort, Jodhpur, India",
    "Phi Phi Islands, Krabi, Thailand", "Grand Palace, Bangkok, Thailand", "Wat Arun, Bangkok, Thailand",
    "Wat Phra Kaew, Bangkok, Thailand", "Ayutthaya Ruins, Ayutthaya, Thailand", "Uluru, Northern Territory, Australia",
    "Sydney Opera House, Sydney, Australia", "Sydney Harbour Bridge, Sydney, Australia", "Great Barrier Reef, Queensland, Australia",
    "Blue Mountains, New South Wales, Australia", "Hobbiton Movie Set, Matamata, New Zealand", "Milford Sound, Fiordland, New Zealand",
    "Sky Tower, Auckland, New Zealand", "Te Papa Museum, Wellington, New Zealand", "Cliffs of Moher, Clare, Ireland",
    "Blarney Castle, Cork, Ireland", "Giant’s Causeway, Antrim, United Kingdom", "Skellig Michael, Kerry, Ireland",
    "Meteora Monasteries, Kalambaka, Greece", "Delphi Ruins, Delphi, Greece", "Mykonos Windmills, Mykonos, Greece",
    "Dubrovnik Old Town, Dubrovnik, Croatia", "Plitvice Lakes, Plitvice, Croatia", "Lake Bled, Bled, Slovenia",
    "Predjama Castle, Postojna, Slovenia", "Bran Castle, Brasov, Romania", "Palace of Parliament, Bucharest, Romania",
    "Buda Castle, Budapest, Hungary", "Fisherman’s Bastion, Budapest, Hungary", "Auschwitz Memorial, Oswiecim, Poland",
    "Wieliczka Salt Mine, Krakow, Poland", "Wawel Castle, Krakow, Poland", "Vilnius Old Town, Vilnius, Lithuania",
    "Riga Old Town, Riga, Latvia", "Tallinn Old Town, Tallinn, Estonia", "Helsinki Cathedral, Helsinki, Finland",
    "Suomenlinna Fortress, Helsinki, Finland", "Tivoli Gardens, Copenhagen, Denmark", "Nyhavn Harbor, Copenhagen, Denmark",
    "Oslo Opera House, Oslo, Norway", "Geirangerfjord, Geiranger, Norway", "Preikestolen, Rogaland, Norway",
    "Icehotel, Jukkasjärvi, Sweden", "Vasa Museum, Stockholm, Sweden", "Gamla Stan, Stockholm, Sweden",
    "Blue Lagoon, Grindavik, Iceland", "Gullfoss Waterfall, Iceland", "Thingvellir National Park, Iceland",
    "Chamonix Mont Blanc, Chamonix, France", "Mont Blanc, Alps, France", "Matterhorn, Zermatt, Switzerland",
    "Jungfraujoch, Jungfrau Region, Switzerland", "Château de Chillon, Montreux, Switzerland", "Andorra la Vella Old Town, Andorra la Vella, Andorra",
    "Monaco Harbor, Monaco, Monaco", "Monte Carlo Casino, Monte Carlo, Monaco", "Carthage Ruins, Tunis, Tunisia",
    "Medina of Marrakech, Marrakech, Morocco", "Hassan II Mosque, Casablanca, Morocco", "Ait Benhaddou, Ouarzazate, Morocco",
    "Lalibela Churches, Lalibela, Ethiopia", "Simien Mountains, Amhara, Ethiopia", "Robben Island, Cape Town, South Africa",
    "Okavango Delta, Botswana, Botswana", "Skeleton Coast, Namibia, Namibia", "Petra Treasury, Petra, Jordan",
    "Dead Sea Scrolls Cave, Qumran, West Bank", "Mount Sinai, Sinai Peninsula, Egypt"
];

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

    const fetchLocations = () => {
        if (locationInput.length < 2) return;
        setLoadingLocation(true);

        const term = locationInput.toLowerCase();
        const matches = TOURIST_LOCATIONS.filter(loc => loc.toLowerCase().includes(term));

        // Take top 5 matches
        setLocationResults(matches.slice(0, 5));
        setLoadingLocation(false);
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
