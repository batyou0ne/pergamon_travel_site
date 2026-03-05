import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Search, User, Plus } from "lucide-react";
import "./BottomNav.css";

const BottomNav = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    if (!user) return null; // Only show bottom nav for logged-in users

    return (
        <nav className="bottom-nav">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} title="Feed">
                <span className="nav-icon"><Home size={24} /></span>
            </Link>
            <Link to="/explore" className={`nav-link ${isActive("/explore") ? "active" : ""}`} title="Explore">
                <span className="nav-icon"><Search size={24} /></span>
            </Link>
            <Link to="/create-post" className="nav-link new-post-fab" title="Post">
                <span className="nav-icon" style={{ color: "var(--bg-color)", display: "flex", alignItems: "center" }}><Plus size={28} /></span>
            </Link>
            <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`} title="Profile">
                <span className="nav-icon"><User size={24} /></span>
            </Link>
        </nav>
    );
};

export default BottomNav;
