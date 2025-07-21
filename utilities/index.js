const Util = {}

/* **************************************
 * Constructs the nav HTML unordered list
 *****************************************/
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let items = [
    { name: "Home", url: "/", title: "Home page" }
  ]

  if (data?.rows?.length > 0) {
    data.rows.forEach((row) => {
      items.push({
        name: row.classification_name,
        url: `/inv/type/${row.classification_id}`, // MUST USE ID HERE
        title: `See our inventory of ${row.classification_name} vehicles`
      })
    })
  } else {
    console.error("⚠️ No classifications found")
    // Fallback items if DB fails
    items.push(
      { name: "Custom", url: "/inv/type/1" },
      { name: "SUV", url: "/inv/type/3" },
      { name: "Truck", url: "/inv/type/4" },
      { name: "Sedan", url: "/inv/type/5" }
    )
  }
  return items
}


Util.buildClassificationGrid = async function (data) { /* ... */ }
Util.buildInventoryDisplay = async function (data) { /* ... */ }
Util.buildErrorPage = async function () { /* ... */ }
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
