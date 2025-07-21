const invModel = require("../models/inventory-model");

const utilities = {};

/* ***************************
 * Build navigation bar
 *************************** */
utilities.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  if (data && data.rows && data.rows.length > 0) {
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
  } else {
    console.error("⚠️ No classifications found or database not returning rows.");
  }

  list += "</ul>";
  return list;
};

/* ***************************
 * Async error handler wrapper
 *************************** */
utilities.handleErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(err => {
      console.error(`Error at: "${req.originalUrl}": ${err.message}`);
      next(err);
    });
};

module.exports = utilities;