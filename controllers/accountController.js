const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const messages = req.flash("notice") || [];
    res.render("account/login", {
      title: "Login",
      nav,
      messages,
      errors: null
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const messages = req.flash("notice") || [];
    res.render("account/register", {
      title: "Register",
      nav,
      messages,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  
  let hashedPassword;
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      messages: req.flash("notice"),
      errors: null,
    });
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const user = await accountModel.validateLogin(account_email, account_password);

  if (user) {
    req.flash("notice", "Login successful!");
    res.redirect("/"); 
  } else {
    req.flash("notice", "Login failed. Please check your email and password.");
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      errors: null,
      account_email, 
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin };