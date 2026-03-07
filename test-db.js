const { Client } = require('pg');

const run = async () => {
    const directUrl = "postgresql://postgres.rhwmwxioqlgolvvsltcd:dijjud-xiMsi1-hiznen@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 5000 });
    try {
        console.log("Connecting to", directUrl);
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("Time is", res.rows[0]);
    } catch (err) {
        console.error("Connection error", err);
    } finally {
        await client.end();
    }
};

run();
