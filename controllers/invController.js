const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    
    if (!data || data.length === 0) {
      throw new Error('No inventory found for this classification');
    }

    const [grid, nav] = await Promise.all([
      utilities.buildClassificationGrid(data),
      utilities.getNav()
    ]);

    res.render("./inventory/classification", {
      title: `${data[0].classification_name} Vehicles`,
      nav,
      grid,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
  try {
    const inv_id = req.params.inventoryId;
    const data = await invModel.getInventoryByInventoryId(inv_id);
    
    if (!data || data.length === 0) {
      throw new Error('Inventory item not found');
    }

    const [grid, nav] = await Promise.all([
      utilities.buildInventoryDisplay(data),
      utilities.getNav()
    ]);

    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      grid,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 *  Build inventory management page
 * **************************** */
invCont.buildInvManagement = async function(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 *  Build add classification page
 * **************************** */
invCont.buildAddClassification = async function(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.processAddNewClassification = async function(req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addNewClassification(classification_name);

    if (!result) {
      throw new Error('Classification addition failed');
    }

    req.flash('notice', `${classification_name} successfully added.`);
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      errors: null
    });
  } catch (error) {
    req.flash("notice", "Something went wrong.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      errors: null
    });
  }
};

/* *****************************
 *  Build add inventory page
 * **************************** */
invCont.buildAddInventory = async function(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;