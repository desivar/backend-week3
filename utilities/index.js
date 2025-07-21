const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Constructs the nav HTML unordered list
 ************************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let list = "<ul>"
    
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
      // Fallback to static nav if database fails
      return [
        { name: 'Home', url: '/' },
        { name: 'Custom', url: '/inv/type/1' },
        { name: 'SUV', url: '/inv/type/3' },
        { name: 'Truck', url: '/inv/type/4' },
        { name: 'Sedan', url: '/inv/type/5' }
      ];
    }

    list += "</ul>"
    return list
  } catch (error) {
    console.error("Error building navigation:", error)
    // Return static nav as fallback
    return [
      { name: 'Home', url: '/' },
      { name: 'Custom', url: '/inv/type/1' },
      { name: 'SUV', url: '/inv/type/3' },
      { name: 'Truck', url: '/inv/type/4' },
      { name: 'Sedan', url: '/inv/type/5' }
    ];
  }
}

Util.buildClassificationGrid = async function (data) {
  // Your implementation here
}

Util.buildInventoryDisplay = async function (data) {
  // Your implementation here
}

Util.buildErrorPage = async function () {
  // Your implementation here
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util