// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view, Unit 4 Individual Activity
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification detail view, Unit 4 Individual Activity
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory detail view, Unit 4 Individual Activity
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to get inventory for AJAXroute. Week 5, AJAX Select Inventory Activity
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit the inventory form. Week 5, Update Inventory item (Step 1) 
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
 
// Route to delete the inventory form. Week 5, Team Activity
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));

// Process the Add Classification data, Unit 4 Individual Activity
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Process the Add Inventory data, Unit 4 Individual Activity
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to update the inventory form. Week 5, Update Inventory item (Step 2) 
 router.post(
   "/update/",
   validate.newInventoryRules(),
   validate.checkUpdateData,
   utilities.handleErrors(invController.updateInventory))

// Route to delete the inventory form. Week 5, Update Inventory item (Step 2) 
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory));

module.exports = router;