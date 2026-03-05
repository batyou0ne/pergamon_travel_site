const mariadb = require("mariadb");

async function test() {
    const url = "mysql://root:12341234@127.0.0.1:3306/travel_app_db";

    try {
        const pool = mariadb.createPool(url);
        const conn = await pool.getConnection();
        console.log("Raw string connection SUCCESS!");
        conn.release();
        pool.end();
    } catch (err) {
        console.error("String connection failed:", err);
    }
}
test();
