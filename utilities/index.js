const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Constructs the nav HTML unordered list
 ************************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  if (data && data.rows && data.rows.length > 0) {
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_name + // <--- CHANGED FROM classification_id TO classification_name
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

// ... (rest of your Util functions remain the same)
Util.buildClassificationGrid = async function (data) { /* ... */ }
Util.buildInventoryDisplay = async function (data) { /* ... */ }
Util.buildErrorPage = async function () { /* ... */ }
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

