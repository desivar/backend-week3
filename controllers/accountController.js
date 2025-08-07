/* ***********************
 * Account Controller
 *************************/
const accountModel = require("../models/account-model");
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver registration view
   Unit 4, server-side activity
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/* ******************************************
 * Deliver login view
 * Unit 4, server-side activity
 *******************************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ******************************************
 * Deliver Account Management view
 * Unit 5, login: JWT and Cookie
 *******************************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
   Unit 4, server-side activity
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    ) 


    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

/* ****************************************
 *  Process Login request
    Unit 5, Login Process activity
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 /* ****************************************
 *  Process Logout request
    Week 6
 * ************************************ */
async function accountLogout(req, res) {
  try {
   res.cookie("jwt")
   res.redirect("/")
   }
   catch (error) {
    res.redirect("/")
  }}
 

/* ****************************************
*  Deliver Update Account view
   Week 5
* *************************************** */
async function buildAccountUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Update Account view
   Week 5
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  ) 
  if (updResult) {
    req.flash(
      "notice",
      `Congratulations, the update was successful.`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}



/* ****************************************
*  Process Update Account view
   Week 5
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, the processing for updating the password failed.')
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname, 
      account_lastname, 
      account_email
    })
  }

  const passResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,
  ) 


  if (passResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re password was updated.`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      updateAccount
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      account_id,
      account_firstname, 
      account_lastname, 
      account_email
    })
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountLogout, buildAccountManagement, buildAccountUpdateView, updateAccount, updatePassword }