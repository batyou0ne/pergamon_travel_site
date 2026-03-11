const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const destinationRoutes = require("./routes/destination.routes");
const tripRoutes = require("./routes/trip.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// ─── Security & Logging Middleware ───────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(
    cors({
        // Allow the specific Vercel URL, localhost, and any custom CLIENT_URL from Render env
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            const allowedOrigins = [
                "http://localhost:5173",
                "https://pergamontravelsite-nw65bx8r8-batuhan-keskins-projects.vercel.app",
                "https://pergamontravelsite-jcw1j0ll6-batuhan-keskins-projects.vercel.app",
                "https://pergamon-travel-site.vercel.app"
            ];

            if (process.env.CLIENT_URL) {
                allowedOrigins.push(process.env.CLIENT_URL);
            }

            // You can also just return true to allow ALL origins in development/testing
            // if (allowedOrigins.indexOf(origin) === -1) { ... }
            return callback(null, true); // <--- TEMPORARILY ALLOWING ALL ORIGINS TO FIX THE BUG FAST
        },
        credentials: true,
    })
);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ─── Static Files ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
