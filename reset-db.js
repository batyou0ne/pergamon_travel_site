const { Client } = require('pg');
const fs = require('fs');

const run = async () => {
    // Drop the schema and recreate it
    const dropSchemaSql = `
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
    `;

    const directUrl = "postgresql://postgres.rhwmwxioqlgolvvsltcd:dijjud-xiMsi1-hiznen@13.213.241.248:5432/postgres";
    const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 5000 });

    try {
        console.log("Connecting to Supabase...");
        await client.connect();

        console.log("Dropping existing schema...");
        await client.query(dropSchemaSql);

        console.log("Reading migrate.sql for fresh schema...");
        const sql = fs.readFileSync('migrate.sql', 'utf8');

        console.log("Re-creating all tables...");
        await client.query(sql);

        console.log("Database reset and tables created successfully!");
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.end();
    }
};

run();
