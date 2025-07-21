const invModel = require("../models/inventory-model");

const Util = {
  /* ****************************************
  * ERROR HANDLER MIDDLEWARE
  * Wrap route handlers to catch async errors
  **************************************** */
  handleErrors: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  /* ****************************************
  * NAVIGATION BUILDER
  * Returns array of navigation items
  * Format: { name: string, url: string, title: string }
  **************************************** */
  getNav: async function() {
    try {
      const data = await invModel.getClassifications();
      const navItems = [
        { name: "Home", url: "/", title: "Home page" }
      ];

      if (data?.rows?.length > 0) {
        data.rows.forEach(row => {
          navItems.push({
            name: row.classification_name,
            url: `/inv/type/${row.classification_id}`,
            title: `Browse ${row.classification_name} vehicles`
          });
        });
      }
      return navItems;
    } catch (error) {
      console.error("Navigation error:", error);
      return [ // Fallback items if database fails
        { name: "Home", url: "/" },
        { name: "Custom", url: "/inv/type/1" },
        { name: "SUV", url: "/inv/type/3" },
        { name: "Truck", url: "/inv/type/4" },
        { name: "Sedan", url: "/inv/type/5" }
      ];
    }
  },

  /* ****************************************
  * CLASSIFICATION GRID BUILDER
  * Transforms classification data into HTML grid
  **************************************** */
  buildClassificationGrid: async function(data) {
    // Your existing grid building logic here
    let grid = '';
    // ... implementation ...
    return grid;
  },

  /* ****************************************
  * INVENTORY DISPLAY BUILDER
  * Formats inventory data for display
  **************************************** */
  buildInventoryDisplay: async function(data) {
    // Your existing display logic here
    let display = '';
    // ... implementation ...
    return display;
  }
};

module.exports = Util;