require("dotenv").config();
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        console.log("✅ Database connected successfully");

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📌 Environment: ${process.env.NODE_ENV}`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("💤 Server closed. Database disconnected.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

        // Unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.error("UNHANDLED REJECTION:", err);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
