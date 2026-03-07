const { Client } = require('pg');
const fs = require('fs');

const run = async () => {
    const directUrl = "postgresql://postgres.rhwmwxioqlgolvvsltcd:dijjud-xiMsi1-hiznen@13.213.241.248:5432/postgres";
    const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 5000 });
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Reading migrate.sql...");
        const sql = fs.readFileSync('migrate.sql', 'utf8');
        console.log("Executing migration schema...");
        await client.query(sql);
        console.log("Migration executed successfully!");
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.end();
    }
};

run();
