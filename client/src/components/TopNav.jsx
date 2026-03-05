import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Search, User, PlusCircle, Landmark, Compass, MapPin, LogOut } from "lucide-react";
import "./TopNav.css";

const TopNav = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="topnav">
            <div className="topnav__container">
                <div className="topnav__left">
                    <Link to="/" className="topnav__logo">
                        <span className="logo-icon"><Landmark size={28} /></span>
                        <span className="logo-text">Pergamon</span>
                    </Link>
                </div>

                <nav className="topnav__center">
                    <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`} title="Feed">
                        <Home size={22} />
                        <span>Feed</span>
                    </Link>
                    <Link to="/explore" className={`nav-item ${isActive("/explore") ? "active" : ""}`} title="Explore">
                        <Compass size={22} />
                        <span>Explore</span>
                    </Link>
                    {user && (
                        <Link to="/destinations" className={`nav-item ${isActive("/destinations") ? "active" : ""}`} title="Destinations">
                            <MapPin size={22} />
                            <span>Destinations</span>
                        </Link>
                    )}
                </nav>

                <div className="topnav__right">
                    {user ? (
                        <>
                            <div className="topnav__actions-group">
                                <Link to="/create-post" className="nav-item new-post-btn" title="Create Post">
                                    <PlusCircle size={22} />
                                    <span className="hide-mobile">Post</span>
                                </Link>
                                <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`} title="Profile">
                                    <User size={22} />
                                    <span className="hide-mobile">Profile</span>
                                </Link>
                            </div>
                            <button className="nav-item user-menu" onClick={logout} title="Log out">
                                <LogOut size={22} />
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNav;
