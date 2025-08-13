const pool = require("../database/");
const bcrypt = require("bcryptjs");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Rethrow for controller to handle
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_id FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Email check error:", error);
    throw error;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, 
       account_email, account_type, account_password 
       FROM account WHERE account_email = $1`,
      [account_email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Get by email error:", error);
    throw error;
  }
}

/* *****************************
 * Get account by ID
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, 
       account_email, account_type 
       FROM account WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Get by ID error:", error);
    throw error;
  }
}

/* *****************************
 * Update Account Information
 * ***************************** */
async function updateAccount(
  account_id, 
  account_firstname, 
  account_lastname, 
  account_email
) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1, 
          account_lastname = $2, 
          account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Update account error:", error);
    throw error;
  }
}

/* *****************************
 * Update Account Password
 * ***************************** */
async function updatePassword(account_id, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id`;
    
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
};