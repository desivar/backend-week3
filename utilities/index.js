const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * Unit 3, Activities
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr >'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + '<b>' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + ' </b>' + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryDetail = async function(data){
  let detail = "";
  if(data.length > 0){
    data.forEach(vehicle => { 
      detail += '<div class="detailPage">'
      detail += '<div class="detailImage">'
      detail +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      detail += '</div>'
      detail += '<div class="detailInfo">'
      detail += '<p>' + '<b>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details ' + '</b>' + '</p>'
      detail += '<p>' + '<b>' + 'Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</b>' + '</p>'
      detail += '<p>' + '<b>' + 'Description:' + ' </b>' + vehicle.inv_description + '</p>'
      detail += '<p>' + '<b>' + 'Color:' + ' </b>' + vehicle.inv_color + '</p>'
      detail += '<p>' + '<b>' + 'Miles:' + ' </b>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      detail += '</div>'
      detail += '</div>'
    })
  } else { 
    detail += '<p class="notice">Sorry, the vehicles detail view is not available.</p>'
  }
  return detail
}


/* ************************
 * Options for the Add Inventory Form
 * Unit 4, Individual Activity
 ************************** */
  Util.buildClassificationList = async function (optionSelected) {
  let data = await invModel.getClassifications()
  let options = '<select name="classification_id" id="classification_id" required>'
  options += "<option value = ''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    options += `<option value ="${row.classification_id}" ${row.classification_id === Number(optionSelected) ? 'selected' : ''}>${row.classification_name}</option>`
  })
  options += "</select>"
  return options
}

/* ****************************************
 *  Check Login
 *  Unit 5, JWT Authorization Activity
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
* Unit 5
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 module.exports = Util