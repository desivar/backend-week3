const invModel = require("../models/inventory-model");
const Util = {};

Util.getNav = async function() {
  try {
    const data = await invModel.getClassifications();
    let navItems = [
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
    return [
      { name: "Home", url: "/" },
      { name: "Custom", url: "/inv/type/1" },
      { name: "SUV", url: "/inv/type/3" },
      { name: "Truck", url: "/inv/type/4" },
      { name: "Sedan", url: "/inv/type/5" }
    ];
  }
};

module.exports = Util;