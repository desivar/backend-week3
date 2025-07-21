const utilities = require("../utilities/");

const baseController = {};

baseController.buildHome = async function(req, res) {
  try {
    const nav = await utilities.getNav();
    console.log('Navigation HTML generated:', nav); // Debug log
    
    res.render("index", {
      title: "Home",
      nav,
      // Add other default variables if needed
    });

  } catch (error) {
    console.error('Error in buildHome:', error);
    
    // Emergency fallback navigation
    const emergencyNav = `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
      </ul>
    `;
    
    res.status(500).render("index", {
      title: "Home",
      nav: emergencyNav,
      errors: [{msg: 'Sorry, we encountered an error'}]
    });
  }
};

module.exports = baseController;