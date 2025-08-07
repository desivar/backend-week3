const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

///*  **********************************
// *  Classification Form Data Validation Rules
// *  Unit 4 Individual Activity
// * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage("Please provide a correct classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists) {
          throw new Error("Classification exists. Please try a new one.")
        }
      }),
  ]
}

///*  **********************************
// *  Inventory Form  Data Validation Rules
// *  Unit 4 Individual Activity
// * ********************************* */
    validate.inventoryRules = () => {
      return [

        // classification_id is required and must be string
        body("classification_id")
          .trim()
          .isLength({ min: 1 })
          .notEmpty()
          .withMessage("Please provide a classification name."), // on error this message is sent.

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // inv_image is required and must be string
    body("inv_image")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please provide a image."), // on error this message is sent.

    // inv_thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please provide a thumbnail."), // on error this message is sent.

    // inv_price is required and must be string
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide a price."), // on error this message is sent.

    // inv_year is required and must be string
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please provide a year."), // on error this message is sent.

    // inv_miles is required and must be string
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide the miles."), // on error this message is sent.


    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."), // on error this message is sent.
  ]
}

///*  **********************************
// *  Check data and return errors or continue to update inventory
// *  Week 5, Update Inventory item (Step 2) 
// * ********************************* */
validate.newInventoryRules = () => {
  return [

    // classification_id is required and must be string
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Please provide a classification name."), // on error this message is sent.

// inv_make is required and must be string
body("inv_make")
  .trim()
  .isLength({ min: 3 })
  .withMessage("Please provide a make."), // on error this message is sent.

// inv_model is required and must be string
body("inv_model")
  .trim()
  .isLength({ min: 3 })
  .withMessage("Please provide a model."), // on error this message is sent.

// inv_description is required and must be string
body("inv_description")
  .trim()
  .isLength({ min: 5 })
  .withMessage("Please provide a description."), // on error this message is sent.

// inv_image is required and must be string
body("inv_image")
  .trim()
  .isLength({ min: 10 })
  .withMessage("Please provide a image."), // on error this message is sent.

// inv_thumbnail is required and must be string
body("inv_thumbnail")
  .trim()
  .isLength({ min: 10 })
  .withMessage("Please provide a thumbnail."), // on error this message is sent.

// inv_price is required and must be string
body("inv_price")
  .trim()
  .isLength({ min: 1 })
  .isNumeric()
  .withMessage("Please provide a price."), // on error this message is sent.

// inv_year is required and must be string
body("inv_year")
  .trim()
  .isLength({ min: 4, max: 4 })
  .isNumeric()
  .withMessage("Please provide a year."), // on error this message is sent.

// inv_miles is required and must be string
body("inv_miles")
  .trim()
  .isLength({ min: 1 })
  .isNumeric()
  .withMessage("Please provide the miles."), // on error this message is sent.


// inv_color is required and must be string
body("inv_color")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Please provide a color."), // on error this message is sent.
]
}

///* ******************************
// * Check data and return errors or continue to add classification
// *  Unit 4 Individual Activity
// * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

///* ******************************
// * Check data and return errors or continue to add to inventory
// * Unit 4, Individual Activity
// * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let options = await utilities.buildClassificationList(classification_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      options,
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ***************************
 *  Check data and return errors or continue to update inventory
 *  Week 5, Update Inventory item (Step 2) 
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let options = await utilities.buildClassificationList(classification_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      options,
      nav,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate