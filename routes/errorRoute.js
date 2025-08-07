// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to handle footer error
router.get("/triggerError", utilities.handleErrors(errorController.triggerError));

module.exports = router;