const pool = require("../database/"); // Assuming your database connection is at this path

async function addInquiry(client_name, client_email, message) {
    try {
        const sql = "INSERT INTO inquiries (client_name, client_email, message) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(sql, [client_name, client_email, message]);
        return result;
    } catch (error) {
        throw new Error("Could not add inquiry to the database.");
    }
}

module.exports = {
    addInquiry
};