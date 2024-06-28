const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);
  const vehicleDetail = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    vehicleDetail,
  });
};

module.exports = invCont