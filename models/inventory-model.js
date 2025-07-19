const pool = require("../database/")

/*****************************
 * Get all classification data
 *************************** */
async function getClassifications() {
    try {
        const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
        console.log("getClassifications result rows:", data.rows); // Add this line
        return data.rows;
    } catch (error) {
        console.error("***** getClassifications caught error:", error.message); // Change to .message for more detail
        return [];
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