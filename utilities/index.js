const invModel = require("../models/inventory-model");

const Util = {
  /* ****************************************
  * REQUIRED ERROR HANDLER (for all routes)
  **************************************** */
  handleErrors: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  /* ****************************************
  * WORKING NAVIGATION (exactly as you need)
  **************************************** */
  getNav: async function() {
    const data = await invModel.getClassifications();
    let html = '<ul class="nav-list">';
    html += '<li><a href="/">Home</a></li>';

    data.rows.forEach(row => {
      html += `
        <li>
          <a href="/inv/type/${row.classification_id}">
            ${row.classification_name}
          </a>
        </li>`;
    });

    html += '</ul>';
    return html;
  }
};

module.exports = Util;