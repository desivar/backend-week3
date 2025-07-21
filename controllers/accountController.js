const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const accountController = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res, next) => {
  res.render("account/login", {
    title: "Login",
    nav: await utilities.getNav(),
    errors: null,
  });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async (req, res, next) => {
  res.render("account/register", {
    title: "Register",
    nav: await utilities.getNav(),
    errors: null,
  });
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      });
    }
    
    throw new Error("Registration failed");
    
  } catch (error) {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
};

module.exports = accountController;