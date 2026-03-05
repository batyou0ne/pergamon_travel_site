const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const mariadb = require("mariadb");
require("dotenv").config();

async function testPrisma() {
    const url = process.env.DATABASE_URL;
    console.log("Database URL:", url);

    const parsed = new URL(url);
    const config = {
        host: parsed.hostname,
        port: parsed.port ? parseInt(parsed.port) : 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, ""),
        connectionLimit: 5,
        bigIntAsNumber: true,
    };

    console.log("Parsed Config:", config);

    const pool = mariadb.createPool(config);
    const adapter = new PrismaMariaDb(pool);

    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Running Prisma query...");
        const reqStart = Date.now();
        const res = await prisma.user.findMany({ take: 1 });
        console.log("Query success! Found users:", res);
        console.log("Time taken:", Date.now() - reqStart, "ms");
    } catch (err) {
        console.error("Prisma error:", err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

testPrisma();
