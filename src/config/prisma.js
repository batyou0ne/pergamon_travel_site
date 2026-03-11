const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// The explicit connection and logging should be handled in server.js,
// as indicated by the instruction "add more detailed logging in server.js".
// This file should only export the PrismaClient instance.
module.exports = prisma;
