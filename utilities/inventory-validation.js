const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Add Inventory Data Validation Rules
* ********************************* */
validate.addInventoryRules = () => {
  return [
    // classification_id is required and must be a valid number
    body("classification_id")
      .trim()
      .notEmpty().withMessage("Classification is required.")
      .isNumeric().withMessage("Invalid classification ID."),

    // make is required and must be at least 3 characters long
    body("inv_make")
      .trim()
      .escape()
      .notEmpty().withMessage("Make is required.")
      .isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),

    // model is required and must be at least 3 characters long
    body("inv_model")
      .trim()
      .escape()
      .notEmpty().withMessage("Model is required.")
      .isLength({ min: 3 }).withMessage("Model must be at least 3 characters long."),

    // description is required and must be at least 3 characters long
    body("inv_description")
      .trim()
      .escape()
      .notEmpty().withMessage("Description is required.")
      .isLength({ min: 3 }).withMessage("Description must be at least 3 characters long."),

    // image path is required and must be a valid path
    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required.")
      .isURL().withMessage("Invalid image path."),

    // thumbnail path is required and must be a valid path
    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required.")
      .isURL().withMessage("Invalid thumbnail path."),

    // price is required and must be a valid decimal or integer
    body("inv_price")
      .trim()
      .notEmpty().withMessage("Price is required.")
      .matches(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/).withMessage("Invalid price format."),

    // year is required and must be a 4-digit year
    body("inv_year")
      .trim()
      .notEmpty().withMessage("Year is required.")
      .matches(/^\d{4}$/).withMessage("Year must be a 4-digit number."),

    // miles is required and must be digits only
    body("inv_miles")
      .trim()
      .notEmpty().withMessage("Miles is required.")
      .matches(/^\d+$/).withMessage("Miles must be digits only."),

    // color is required and must be at least 3 characters long
    body("inv_color")
      .trim()
      .escape()
      .notEmpty().withMessage("Color is required.")
      .isLength({ min: 3 }).withMessage("Color must be at least 3 characters long."),
  ]
}

/* ******************************
* Check data and return errors or continue to add inventory
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate