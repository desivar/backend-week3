const { Pool } = require("pg");
require("dotenv").config(); // This is for local development only

/* ***************
 * Connection Pool
 * *************** */
let pool;

// Determine if we are in development or production environment
// This needs to be correctly handled for Render to connect
if (process.env.NODE_ENV === "production") { // Render typically sets NODE_ENV to 'production'
    pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        ssl: {
            // Use rejectUnauthorized: false when PGSSLMODE is 'no-verify'
            // This is commonly required for Render connections
            rejectUnauthorized: process.env.PGSSLMODE === 'no-verify' ? false : true,
        },
    });

    // In production, we typically just export the pool directly for other models to use
    module.exports = pool;

} else { // Development environment (local machine)
    pool = new Pool({
        // For local development, use individual PG variables from .env
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        ssl: {
            rejectUnauthorized: false, // For local self-signed certs or no SSL
        },
    });

    // Added for troubleshooting queries during development
    // This allows you to add console.log for queries locally
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log("executed query", { text });
                return res;
            } catch (error) {
                console.error("error in query", { text });
                throw error;
            }
        },
    };
}