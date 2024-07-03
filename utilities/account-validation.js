const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty().withMessage("First name is required.")
      .bail()
      .if(body("account_firstname").notEmpty())
      .isLength({ min: 1 }).withMessage("First name must be at least 1 character long."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty().withMessage("Last name is required.")
      .bail()
      .if(body("account_lastname").notEmpty())
      .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty().withMessage("Email is required.")
      .bail() 
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail(), // refer to validator.js docs

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
      .bail() 
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

module.exports = validate;