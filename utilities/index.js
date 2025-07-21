// In utilities/index.js
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    console.log("Classification data:", data.rows); // Debug log
    
    let list = "<ul class='nav-list'>";
    list += '<li><a href="/">Home</a></li>';

    if (data?.rows?.length > 0) {
      data.rows.forEach((row) => {
        list += `<li>
          <a href="/inv/type/${row.classification_id}" 
             class="nav-link">
            ${row.classification_name}
          </a>
        </li>`;
      });
    } else {
      console.error("No classifications found - using fallback");
      // Hardcoded fallback matching your database
      list += `
        <li><a href="/inv/type/1">Custom</a></li>
        <li><a href="/inv/type/2">Sport</a></li>
        <li><a href="/inv/type/3">SUV</a></li>
        <li><a href="/inv/type/4">Truck</a></li>
        <li><a href="/inv/type/5">Sedan</a></li>
      `;
    }

    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Navigation generation error:", error);
    return `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">All Vehicles</a></li>
      </ul>
    `;
  }
};