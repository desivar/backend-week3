const invModel = require("../models/inventory-model");

// Initialize Util as an object
const Util = {};

// Add getNav method to Util
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    if (data && data.rows && data.rows.length > 0) {
      data.rows.forEach((row) => {
        list += `<li>
          <a href="/inv/type/${row.classification_id}" 
             title="See our ${row.classification_name} inventory">
            ${row.classification_name}
          </a>
        </li>`;
      });
    } else {
      console.error("⚠️ No classifications found");
    }

    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Navigation generation error:", error);
    return '<ul><li><a href="/">Home</a></li></ul>';
  }
};

// Export the Util object
module.exports = Util;