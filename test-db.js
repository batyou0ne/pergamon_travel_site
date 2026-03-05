const mariadb = require("mariadb");

async function testConnection() {
    const config = {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "12341234",
        database: "travel_app_db",
        connectionLimit: 5,
    };

    console.log("Creating pool with config:", config);
    const pool = mariadb.createPool(config);

    try {
        console.log("Getting connection...");
        const conn = await pool.getConnection();
        console.log("Connected successfully!");
        const rows = await conn.query("SELECT 1 as val");
        console.log("Query result:", rows);
        conn.release();
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        pool.end();
    }
}

testConnection();
