import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get("/auth/me")
                .then((res) => setUser(res.data.data.user))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const { token, user } = res.data.data;
        localStorage.setItem("token", token);
        setUser(user);
        return user;
    };

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        const { token, user } = res.data.data;
        localStorage.setItem("token", token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
