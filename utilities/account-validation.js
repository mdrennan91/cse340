const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

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
      .normalizeEmail() // refer to validator.js docs
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

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
* Login Data Validation Rules
* ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty().withMessage("Email is required.")
      .bail() 
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
  ];
};

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

/* ******************************
* Check Login Data
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};


/* ******************************
 * Validation rules and checks for account update
 * ***************************** */
validate.updateAccountRules = () => {
  return [
      body("account_firstname").trim().isLength({ min: 1 }).withMessage("First name is required."),
      body("account_lastname").trim().isLength({ min: 1 }).withMessage("Last name is required."),
      body("account_email").trim().isEmail().withMessage("Valid email is required.")
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/update-account", {
          errors,
          title: "Update Account",
          nav,
          accountData: req.body,
          messages: req.flash("notice")
      });
      return;
  }
  next();
};

/* ******************************
 * Validation rules and checks for changing password
 * ***************************** */
validate.changePasswordRules = () => {
  return [
    body("new_password").isLength({ min: 12 }).withMessage("Password must be at least 8 characters long.")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
      .matches(/\d/).withMessage("Password must contain at least one number.")
      .matches(/[\W_]/).withMessage("Password must contain at least one special character.")
  ];
};

validate.checkChangePasswordData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      accountData: req.body,
      messages: req.flash("notice")
    });
    return;
  }
  next();
};

validate.checkChangePasswordData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/update-account", {
          errors,
          title: "Update Account",
          nav,
          accountData: req.body,
          messages: req.flash("notice")
      });
      return;
  }
  next();
};

module.exports = validate;