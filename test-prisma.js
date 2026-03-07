const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Connecting with Prisma Client...");
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log("Prisma query result:", result);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
