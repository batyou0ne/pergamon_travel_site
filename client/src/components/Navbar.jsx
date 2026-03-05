import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => setMenuOpen(false), [location]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">✈</span>
                    <span>
                        <span className="gradient-text">Wander</span>
                        <span style={{ color: "var(--gold)" }}>Lux</span>
                    </span>
                </Link>

                <button
                    className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>

                <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
                    <Link to="/" className={`navbar__link ${isActive("/") ? "active" : ""}`}>Home</Link>
                    <Link to="/destinations" className={`navbar__link ${isActive("/destinations") ? "active" : ""}`}>Destinations</Link>
                    {user && (
                        <Link to="/trips" className={`navbar__link ${isActive("/trips") ? "active" : ""}`}>My Trips</Link>
                    )}
                </div>

                <div className="navbar__actions">
                    {user ? (
                        <>
                            <span className="navbar__user">
                                <span className="navbar__avatar">{user.name[0]}</span>
                                {user.name}
                            </span>
                            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "8px 20px", fontSize: "0.85rem" }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
