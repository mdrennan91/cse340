const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data && data.length > 0 ? data[0].classification_name : 'Unknown'
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);
  const vehicleDetail = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();
  const vehicleName = data ? `${data.inv_make} ${data.inv_model}` : 'Unknown';
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    vehicleDetail,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    messages: req.flash("notice"),
    errors: null,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
    errors: null,
  });
};

/* ***************************
 *  Handle add classification form submission
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);
  if (result) {
    req.flash("notice", "Classification added successfully.");
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("notice") || [],
      errors: null,
    });
  } else {
    req.flash("notice", "Error adding classification.");
    let nav = await utilities.getNav();
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash("notice") || [],
      errors: null,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
      messages: req.flash("notice"),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Handle add inventory form submission
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    const result = await invModel.addInventory({
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
    if (result) {
      req.flash("notice", "Vehicle added successfully.")
      let nav = await utilities.getNav()
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice"),
        errors: null,
      })
    } else {
      req.flash("notice", "Error adding vehicle.")
      let nav = await utilities.getNav()
      res.status(500).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList: await utilities.buildClassificationList(classification_id),
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        messages: req.flash("notice"),
        errors: null,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build delete classification view
 * ************************** */
invCont.buildDeleteClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/delete-classification", {
      title: "Delete Classification",
      nav,
      classificationList,
      messages: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Handle delete classification form submission
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  try {
    const { classification_id } = req.body;
    await invModel.deleteInventoryByClassificationId(classification_id);
    const result = await invModel.deleteClassificationById(classification_id);

    if (result.rowCount) {
      req.flash("notice", "Classification deleted successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Error deleting classification.");
      res.redirect("/inv/delete-classification");
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData && invData.length > 0 && invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont