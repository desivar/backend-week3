// utilities/index.js
const invModel = require("../models/inventory-model");
const Util = {};

/* ****************************************
* Database-Powered Navigation with Image Support
**************************************** */
Util.getNav = async function() {
  try {
    const data = await invModel.getClassifications();
    let html = '<ul class="nav-list">';
    
    // Home link
    html += '<li><a href="/" title="Home page">Home</a></li>';

    // Database-powered menu items
    if (data?.rows?.length > 0) {
      data.rows.forEach(row => {
        html += `
          <li>
            <a href="/inv/type/${row.classification_id}" 
               title="View ${row.classification_name} vehicles">
               ${row.classification_name}
            </a>
          </li>`;
      });
    }

    html += '</ul>';
    return html;

  } catch (error) {
    console.error("Navigation system:", error.message);
    // Emergency fallback (will never trigger if your DB is perfect)
    return `
      <ul class="nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="/inv/type/1">Custom</a></li>
        <li><a href="/inv/type/3">SUV</a></li>
        <li><a href="/inv/type/4">Truck</a></li>
        <li><a href="/inv/type/5">Sedan</a></li>
      </ul>
    `;
  }
};

module.exports = Util;