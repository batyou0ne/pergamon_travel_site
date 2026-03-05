import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Grid3X3, Award, Settings2, Heart, MessageCircle, Camera, MapPin } from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";
import "./Profile.css";

const MOCK_DATA = {
    bio: "🌍 Ready to explore the world.",
    following: 0,
    followers: 0,
    badges: [],
};

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("posts"); // 'posts' or 'badges'
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchUserPosts = async () => {
            try {
                const res = await api.get(`/posts/user/${user.id}`);
                setPosts(res.data.data.posts || []);
            } catch (err) {
                console.error("Failed to load user posts:", err);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchUserPosts();
    }, [user?.id]);

    // Use actual user data, fallback to placeholder if undefined (e.g. loading)
    const displayName = user?.name || "Traveler";
    const username = user?.email?.split('@')[0] || "traveler";
    const avatarInitials = displayName.substring(0, 2).toUpperCase();

    return (
        <div className="profile-container">
            {/* ── Header ── */}
            <header className="profile__header">
                <div className="profile__avatar-container">
                    {user?.avatar ? ( // Conditional rendering for avatar
                        <div className="profile__avatar overflow-hidden">
                            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="profile__avatar">{avatarInitials}</div>
                    )}
                </div>

                <div className="profile__info">
                    <div className="profile__title-row">
                        <h1 className="profile__username">{username}</h1>
                        <div className="profile__actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => setIsEditModalOpen(true)} // Added onClick to open modal
                            >
                                Edit Profile
                            </button>
                            <button className="btn btn-outline profile__settings-btn"><Settings2 size={18} /></button>
                        </div>
                    </div>

                    <div className="profile__stats">
                        <div className="stat"><strong>{posts.length}</strong> posts</div>
                        <div className="stat"><strong>{MOCK_DATA.followers}</strong> followers</div>
                        <div className="stat"><strong>{MOCK_DATA.following}</strong> following</div>
                    </div>

                    <div className="profile__bio">
                        <div className="profile__name">{displayName}</div>
                        {user?.bio ? <p>{user.bio}</p> : <p className="text-secondary italic">No bio yet.</p>}

                        <div className="profile__details-chips">
                            {user?.dreamCity && (
                                <div className="profile__detail-chip dream-city">
                                    <MapPin size={14} /> <span>Next: <strong>{user.dreamCity}</strong></span>
                                </div>
                            )}
                            {user?.languages && (
                                <div className="profile__detail-chip languages">
                                    <MessageCircle size={14} /> <span>{user.languages}</span>
                                </div>
                            )}
                            {user?.travelStyle && (
                                <div className="profile__detail-chip styles">
                                    <Heart size={14} /> <span>{user.travelStyle.split(",").join(" • ")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onUpdate={updateUser}
            />

            {/* ── Mobile Stats (visible only on narrow screens) ── */}
            <div className="profile__stats-mobile">
                <div className="stat-mobile"><strong>{posts.length}</strong><br />posts</div>
                <div className="stat-mobile"><strong>{MOCK_DATA.followers}</strong><br />followers</div>
                <div className="stat-mobile"><strong>{MOCK_DATA.following}</strong><br />following</div>
            </div>

            {/* ── Badges Showcase Horizontal Scroll ── */}
            {MOCK_DATA.badges.length > 0 && (
                <section className="profile__badges-highlight">
                    <h3 className="section-title-sm">Verified Badges</h3>
                    <div className="badges-scroll">
                        {MOCK_DATA.badges.map(badge => (
                            <div key={badge.id} className="badge-item">
                                <div className="badge-item__icon">{badge.icon}</div>
                                <div className="badge-item__name">{badge.name}</div>
                                <div className="badge-item__loc">{badge.location}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Tabs ── */}
            <div className="profile__tabs">
                <button
                    className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <span className="tab-icon"><Grid3X3 size={18} /></span> POSTS
                </button>
                <button
                    className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('badges')}
                >
                    <span className="tab-icon"><Award size={18} /></span> BADGES
                </button>
            </div>

            {/* ── Content Grid ── */}
            {activeTab === 'posts' && (
                <div className="profile__grid posts-grid">
                    {loadingPosts ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.id} className="grid-item post-tn">
                                <img src={post.imageUrl} alt={post.locationName || "Travel moment"} loading="lazy" />
                                <div className="post-tn__overlay">
                                    <span><Heart size={16} fill="white" /> {post.likes || 0}</span>
                                    <span><MessageCircle size={16} fill="white" /> 0</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                            <div className="empty-grid-icon"><Camera size={48} /></div>
                            <h3 className="text-h3">No Photos Yet</h3>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'badges' && (
                <div className="profile__grid badges-grid">
                    {MOCK_DATA.badges.length > 0 ? (
                        MOCK_DATA.badges.map(badge => (
                            <div key={badge.id} className="grid-item badge-card">
                                <div className="badge-card__icon">{badge.icon}</div>
                                <h4 className="badge-card__name">{badge.name}</h4>
                                <p className="badge-card__loc"><MapPin size={14} /> {badge.location}</p>
                                <span className="badge-card__date">Earned {badge.date}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                            <div className="empty-grid-icon"><Award size={48} /></div>
                            <h3 className="text-h3">No Badges Yet</h3>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default Profile;
