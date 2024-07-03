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
        .isInt().withMessage("Invalid classification ID."),
      
      // Make is required and must be at least 3 characters long
      body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("Make is required.")
        .isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
      
      // Model is required and must be at least 3 characters long
      body("inv_model")
        .trim()
        .escape()
        .notEmpty().withMessage("Model is required.")
        .isLength({ min: 3 }).withMessage("Model must be at least 3 characters long."),
      
      // Description is required and must be at least 3 characters long
      body("inv_description")
        .trim()
        .escape()
        .notEmpty().withMessage("Description is required.")
        .isLength({ min: 3 }).withMessage("Description must be at least 3 characters long."),
      
      // Image Path is required
      body("inv_image")
        .trim()
        .escape()
        .notEmpty().withMessage("Image Path is required."),
      
      // Thumbnail Path is required
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty().withMessage("Thumbnail Path is required."),
      
      // Price is required and must be a valid number
      body("inv_price")
        .trim()
        .escape()
        .notEmpty().withMessage("Price is required.")
        .isFloat({ min: 0 }).withMessage("Invalid price."),
      
      // Year is required and must be a 4-digit year
      body("inv_year")
        .trim()
        .escape()
        .notEmpty().withMessage("Year is required.")
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Invalid year."),
      
      // Miles is required and must be a valid number
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty().withMessage("Miles is required.")
        .isInt({ min: 0 }).withMessage("Invalid miles."),
      
      // Color is required and must be at least 3 characters long
      body("inv_color")
        .trim()
        .escape()
        .notEmpty().withMessage("Color is required.")
        .isLength({ min: 3 }).withMessage("Color must be at least 3 characters long.")
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
  
  module.exports = validate;