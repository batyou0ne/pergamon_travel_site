const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Eagerly connect to avoid cold-start latency on first request
prisma.$connect()
  .then(() => console.log("🔌 Prisma connection pool initialized"))
  .catch((err) => console.error("❌ Prisma connection error:", err));

module.exports = prisma;
