import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Landmark } from "lucide-react";
import "./Auth.css";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirm) return setError("Passwords do not match.");
        if (form.password.length < 8) return setError("Password must be at least 8 characters.");
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth__bg" />
            <div className="auth__card glass animate-fade-up">
                <div className="auth__logo">
                    <Landmark size={28} /> Pergamon
                </div>
                <h1 className="auth__title">Start Your Journey</h1>
                <p className="auth__subtitle">Create your free account in seconds</p>

                {error && <div className="auth__error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth__form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth__submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account →"}
                    </button>
                </form>

                <p className="auth__link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
