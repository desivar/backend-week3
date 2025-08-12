const { Pool } = require("pg");

/* ***************
 * Connection Pool
 * *************** */
let pool;

if (process.env.NODE_ENV === "production") {
    pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        ssl: {
            rejectUnauthorized: process.env.PGSSLMODE === 'no-verify' ? false : true,
        },
    });
    module.exports = pool; // Export the pool directly for production
} else { // Development environment (local machine)
    pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        ssl: true, // Recommended for local dev unless you explicitly configured SSL
    });

    // THIS BLOCK MUST BE INSIDE THE ELSE STATEMENT
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log("executed query", { text });
                return res;
            } catch (error) {
                console.error("error in query", { text, error: error.message }); // Added .message for better error detail
                throw error;
            }
        },
    };
}