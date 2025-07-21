const utilities = require("../utilities/");
const baseController = {};

// Base method for all controllers to use
baseController.buildPage = async function(req, res, view, data = {}) {
  try {
    const nav = await utilities.getNav();
    res.render(view, {
      ...data,          // Spread any additional data
      title: data.title || 'Default Title',
      nav,              // Navigation will be included everywhere
      errors: null,     // Default error state
      messages: null    // Default messages
    });
  } catch (error) {
    console.error('Error building page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Homepage specific (example)
baseController.buildHome = async function(req, res) {
  await this.buildPage(req, res, "index", { 
    title: "Home" 
    // Add any home-specific data here
  });
};

module.exports = baseController;