const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        const nav = await utilities.getNav();
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null,
            csrfToken: req.csrfToken(), // <-- Add this line
        });
    } catch (error) {
        next(error);
    }
}


/* ****************************************
 * Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        csrfToken: req.csrfToken() // Add this line
    });
}

/* ****************************************
 * Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const { account_firstname, account_lastname, account_email, account_password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(account_password, 10);

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

        if (regResult.rowCount > 0) {
            req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
            return res.redirect("/account/login");
        } else {
            req.flash("notice", "Sorry, the registration failed.");
            return res.status(501).render("account/register", {
                title: "Registration",
                nav,
                errors: null,
            });
        }
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation
            req.flash("notice", "Email already exists. Please log in or use different email");
            return res.redirect("/account/register");
        }
        next(error);
    }
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res, next) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    
    try {
        const accountData = await accountModel.getAccountByEmail(account_email);
        if (!accountData) {
            req.flash("notice", "Please check your credentials and try again.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }

        if (await bcrypt.compare(account_password, accountData.account_password)) {
            // Create token payload with minimal data
            const tokenPayload = {
                account_id: accountData.account_id,
                account_firstname: accountData.account_firstname,
                account_type: accountData.account_type
            };
            
            const accessToken = jwt.sign(
                tokenPayload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie("jwt", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 3600000
            });

            req.flash("notice", `Welcome ${accountData.account_firstname}`);
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        next(error);
    }
}
/* ****************************************
 * Process logout request
 * ************************************ */
async function accountLogout(req, res) {
    // Clear the JWT cookie first. This happens immediately.
    res.clearCookie("jwt");
    
    // Check if a session exists before trying to destroy it.
    // This is a safety check to prevent the error if a user somehow logs out without a session.
    if (req.session) {
        // Destroy the session, then run the callback function.
        // All code that needs the session MUST be inside this callback.
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                // The session might be gone here, so using req.flash() could still fail.
                // It's safer to just redirect.
                return res.redirect("/account/login");
            }
    
            // These lines will only run AFTER the session is successfully destroyed.
            res.locals.loggedin = 0;
            res.locals.accountData = null;
    
            // Now that the session is destroyed, you can use flash.
            // Note: This won't work correctly as flash requires a session to be present.
            // Let's remove the flash message for the logout redirect.
            // The most robust way to handle this is to use a GET request redirect with a query parameter.
            res.redirect("/?logout=success");
        });
    } else {
        // If no session exists, simply clear the cookie and redirect
        res.locals.loggedin = 0;
        res.locals.accountData = null;
        res.redirect("/?logout=success");
    }
}

/* ****************************************
 * Deliver account management view
 * *************************************** */
async function accountManagement(req, res, next) {
    try {
        const nav = await utilities.getNav();
        res.render("account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
            accountData: res.locals.accountData
        });
    } catch(error) {
        next(error);
    }
}

/* ****************************************
 * Deliver account update view
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
    try {
        const account_id = parseInt(req.params.account_id);
        const nav = await utilities.getNav();
        const accountData = await accountModel.getAccountById(account_id);
        
        res.render("account/update-account", {
            title: "Update Account",
            nav,
            errors: null,
            accountData: accountData, // Pass the account data as a single object
            csrfToken: req.csrfToken() // <-- ADD THIS LINE
        });
    } catch (error) {
        next(error);
    }
}

/* ****************************************
 * Process Account Update
 * *************************************** */
async function updateAccount(req, res, next) {
    try {
        const { account_id, account_firstname, account_lastname, account_email } = req.body;
        const nav = await utilities.getNav();

        const accountResult = await accountModel.updateAccount(
            parseInt(account_id),
            account_firstname,
            account_lastname,
            account_email
        );

        if (accountResult) {
            // Create new token with updated data
            const tokenPayload = {
                account_id: parseInt(account_id),
                account_firstname,
                account_type: res.locals.accountData.account_type
            };
            
            const accessToken = jwt.sign(
                tokenPayload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie("jwt", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 3600000
            });

            req.flash("notice", "Account updated successfully");
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Account update failed");
            return res.status(400).render("account/update-account", {
                title: "Update Account",
                nav,
                errors: null,
                ...req.body
            });
        }
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation
            req.flash("notice", "Email already in use");
            return res.redirect("/account/update/"+req.body.account_id);
        }
        next(error);
    }
}

/* ****************************************
 * Process Password Update
 * *************************************** */
async function updatePassword(req, res, next) {
    try {
        const { account_id, current_password, new_password } = req.body;
        const nav = await utilities.getNav();

        // Verify current password
        const account = await accountModel.getAccountById(account_id);
        if (!await bcrypt.compare(current_password, account.account_password)) {
            req.flash("notice", "Current password is incorrect");
            return res.redirect("/account/update/"+account_id);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update password
        const result = await accountModel.updatePassword(account_id, hashedPassword);
        
        if (result) {
            req.flash("notice", "Password updated successfully");
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Password update failed");
            return res.redirect("/account/update/"+account_id);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    accountManagement,
    accountLogout,
    buildAccountUpdate,
    updateAccount,
    updatePassword,
};