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
      messages
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
      messages
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    console.log("Received data:", req.body);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    console.log("Registration result:", regResult);

    if (regResult.rowCount) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      const messages = req.flash("notice") || [];
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        messages
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      const messages = req.flash("notice") || [];
      res.status(501).render("account/register", {
        title: "Register",
        nav,
        messages
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    next(err);
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };