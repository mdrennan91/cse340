const utilities = require("../utilities");
const accountModel = require("../models/account-model");

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

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
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

module.exports = { buildLogin, buildRegister, registerAccount };