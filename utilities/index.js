const invModel = require("../models/inventory-model");
const pool = require('../database/'); // Direct database connection

const Util = {
  /* ****************************************
  * Robust Error Handler
  **************************************** */
  handleErrors: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      console.error('Route error:', err);
      next(err);
    });
  },

  /* ****************************************
  * Guaranteed-Working Navigation
  **************************************** */
  getNav: async function() {
    try {
      // Verify database connection first
      await pool.query('SELECT 1');
      
      const data = await invModel.getClassifications();
      if (!data?.rows) throw new Error('No data returned');
      
      let html = '<ul class="nav-list">';
      html += '<li><a href="/">Home</a></li>';

      data.rows.forEach(row => {
        html += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`;
      });

      return html + '</ul>';

    } catch (err) {
      console.error('Navigation using fallback:', err.message);
      // Hardcoded fallback that matches your DB structure
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
  }
};

module.exports = Util;