const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Constructs the nav HTML unordered list
 ************************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()  // Make sure this returns { rows: [...] }
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  if (data && data.rows && data.rows.length > 0) {
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
  } else {
    console.error("⚠️ No classifications found or database not returning rows.")
  }

  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// format price in money format
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

/* **************************************
* Build the item details view HTML
************************************** */
Util.buildInventoryDisplay = async function (data) {
  let grid
  let d = data[0]
  if (data.length > 0) {
    grid = '<div id="inv-item-detail">'
    grid += '<div class="detail-img">'
    grid += '<img src="' + d.inv_image
      + '" alt="Image of ' + d.inv_year + " " + d.inv_make + " " + d.inv_model
      + ' on CSE Motors">'
    grid += '</div>'
    grid += '<div class="general-information">'
    grid += '<h3>' + d.inv_make + " " + d.inv_model + ' Details</h3>'
    grid += '<p><span>Price: ' + money.format(d.inv_price) + '</span></p>'
    grid += '<p><span>Description: </span>' + d.inv_description + '</p>'
    grid += '<p><span>Color: </span>' + d.inv_color + '</p>'
    grid += '<p><span>Miles: </span>' + d.inv_miles.toLocaleString('en-US') + '</p>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build error page view HTML
************************************** */
Util.buildErrorPage = async function () {
  let grid = '<p>The Error route is connected correctly.</p>'
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
