Util.getNav = async function() {
  try {
    const data = await invModel.getClassifications();
    
    // Return as ARRAY of items (not HTML string)
    const navItems = [
      { name: "Home", url: "/", title: "Home page" }
    ];

    if (data?.rows?.length > 0) {
      data.rows.forEach(row => {
        navItems.push({
          name: row.classification_name,
          url: `/inv/type/${row.classification_id}`,
          title: `Browse ${row.classification_name}`
        });
      });
    }
    return navItems; // ← Returns clean data array
    
  } catch (error) {
    console.error("Navigation error:", error);
    return [ // Fallback data
      { name: "Home", url: "/" },
      { name: "Custom", url: "/inv/type/1" },
      { name: "SUV", url: "/inv/type/3" },
      { name: "Truck", url: "/inv/type/4" },
      { name: "Sedan", url: "/inv/type/5" }
    ];
  }
};