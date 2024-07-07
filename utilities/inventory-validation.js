const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Add Inventory Data Validation Rules
* ********************************* */
validate.addInventoryRules = () => {
    return [
      // classification_id is required and must be integer
      body("classification_id")
        .trim()
        .escape()
        .notEmpty().withMessage("Classification is required.")
        .bail()
        .isInt().withMessage("Invalid classification ID."),
  
      // Make is required and must be at least 3 characters long
      body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("Make is required.")
        .bail()
        .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
  
      // Model is required and must be at least 3 characters long
      body("inv_model")
        .trim()
        .escape()
        .notEmpty().withMessage("Model is required.")
        .bail()
        .isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
  
      // Description is required and must be at least 3 characters long
      body("inv_description")
        .trim()
        .escape()
        .notEmpty().withMessage("Description is required.")
        .bail()
        .isLength({ min: 3 }).withMessage("Description must be 3 characters"),
  
      // Image Path is required
      body("inv_image")
        .trim()
        .notEmpty().withMessage("Image Path is required."),
  
      // Thumbnail Path is required
      body("inv_thumbnail")
        .trim()
        .notEmpty().withMessage("Thumbnail Path is required."),
  
      // Price is required and must be a valid number
      body("inv_price")
        .trim()
        .escape()
        .notEmpty().withMessage("Price is required.")
        .bail()
        .isFloat({ min: 0 }).withMessage("Invalid price."),
  
      // Year is required and must be a 4-digit year
      body("inv_year")
        .trim()
        .escape()
        .notEmpty().withMessage("Year is required.")
        .bail()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Invalid year."),
  
      // Miles is required and must be a valid number
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty().withMessage("Miles is required.")
        .bail()
        .isInt({ min: 0 }).withMessage("Invalid miles."),
  
      // Color is required and must be at least 3 characters long
      body("inv_color")
        .trim()
        .escape()
        .notEmpty().withMessage("Color is required.")
        .bail()
        .isLength({ min: 3 }).withMessage("Color must be at least 3 characters.")
    ];
  };
  
/* ******************************
* Check data and return errors or continue to inventory submission
* ***************************** */
  validate.checkInventoryData = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(req.body.classification_id);
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        classificationList,
        ...req.body
      });
      return;
    }
    next();
  };

/* ******************************
* Check data and return errors or continue to inventory update
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationList,
      ...req.body
    });
    return;
  }
  next();
};

/*  **********************************
*  Add Classification Data Validation Rules
* ********************************* */
validate.addClassificationRules = () => {
  return [
      // classification_name is required and must be at least 3 characters long
      body("classification_name")
          .trim()
          .escape()
          .notEmpty().withMessage("Classification name is required.")
          .bail()
          .isLength({ min: 3 }).withMessage("Classification name must be at least 3 characters long.")
  ];
};

/* ******************************
* Check data and return errors or continue to classification submission
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("inventory/add-classification", {
          errors,
          title: "Add New Classification",
          nav,
          messages: req.flash("notice"),
          classification_name: req.body.classification_name
      });
      return;
  }
  next();
};
  
/*  **********************************
*  Delete Classification Data Validation Rules
* ********************************* */
validate.deleteClassificationRules = () => {
    return [
      // classification_id is required and must be an integer
      body("classification_id")
        .trim()
        .escape()
        .notEmpty().withMessage("Classification is required.")
        .isInt().withMessage("Invalid classification ID.")
    ];
  };
  
/* ******************************
* Check data and return errors or continue to deletion
* ***************************** */
  validate.checkDeleteClassificationData = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(req.body.classification_id);
      res.render("inventory/delete-classification", {
        errors,
        title: "Delete Classification",
        nav,
        classificationList,
        ...req.body
      });
      return;
    }
    next();
  };
  
  module.exports = validate;