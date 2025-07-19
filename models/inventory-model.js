const pool = require("../database/")

/*****************************
 * Get all classification data
 *************************** */
async function getClassifications() {
    try {
        const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
        return data.rows // <--- IMPORTANT: Return data.rows, not just the query result
    } catch (error) {
        console.error("***** getClassifications error: " + error)
        // Re-throw the error or return an empty array if downstream can handle it.
        // For navigation data, an empty array might be acceptable for graceful degradation.
        // If it's critical, re-throw. Let's start with returning an empty array.
        return [] // Return an empty array if an error occurs fetching classifications
    }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("***** getclassificationsbyid error: " + error)
        return [] // Added for consistency, or re-throw error
    }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryByInventoryId(inventoryId) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inventoryId]
        )
        return data.rows
    } catch (error) {
        console.error("***** getInventoryItemById error: " + error)
        return [] // Added for consistency, or re-throw error
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addNewClassification(classification_name) {
    try {
        const data = await pool.query(
        `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`,
        [classification_name]
        )
        return data.rows
    } catch (error) {
        console.error("***** addNewClassification error: " + error)
        throw error; // Re-throw so the controller can handle it
    }
}

/* ***************************
 * Check for classification in db
 * ************************** */
async function checkForClassification(classification_name) {
    try {
        const data = await pool.query(
            `SELECT * FROM classification WHERE classification_name = $1`,
            [classification_name]
        )
        return data.rowCount
    } catch (error) {
        console.error("***** checkForClassification error: " + error) // Added console.error
        return error.message // This returns a string message, which might be okay for validation
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByInventoryId,
    addNewClassification,
    checkForClassification
};