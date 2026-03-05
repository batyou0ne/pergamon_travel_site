import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";

// Pages
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Destinations from "./pages/Destinations"; // Assuming this exists based on original routes/plan

// Old placeholder for now
const Explore = () => <div style={{ padding: "40px", textAlign: "center" }}>Explore Search Page Coming Soon...</div>;

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner" style={{ margin: "50px auto", display: "block" }} />;
    return user ? children : <Navigate to="/login" replace />;
};

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    if (isAuthPage) {
        return children;
    }

    return (
        <div className="app-layout">
            <TopNav />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

const AppRoutes = () => (
    <MainLayout>
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />

            {/* Main Feed (Public but usually auth-gated; keeping public so visitors can see posts) */}
            <Route path="/" element={<Feed />} />

            {/* Protected Routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-post"
                element={
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </MainLayout>
);

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </BrowserRouter>
);

export default App;
