const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

// Route to the home page
router.get("/", baseController.buildHome);
// Add this to your routes/index.js file
router.get("/checkout/checkout", (req, res) => {
    // This tells Express to render the EJS file at views/checkout/checkout.ejs
    res.render("checkout/checkout");
});

module.exports = router;