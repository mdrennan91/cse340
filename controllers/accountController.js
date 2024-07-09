const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account");
    } else {
      req.flash("notice", "Password is incorrect. Please try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"),
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}


/* ****************************************
 *  Render Account Management View
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/manage", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash("notice"),
    
  })
}

/* ****************************************
 * Function to render update account view
 * ************************************ */
async function buildUpdateAccountView(req, res, next) {
  try {
    console.log("Navigating to update account view..."); // Debugging log
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.params.account_id);
    console.log("Account Data: ", accountData); // Debugging log
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      messages: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildUpdateAccountView: ", error); // Debugging log
    next(error);
  }
}

/* ****************************************
 * Function to handle account update
 * ************************************ */
async function updateAccount(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  let nav = await utilities.getNav();

  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    
    if (updateResult) {
      const updatedAccountData = await accountModel.getAccountById(account_id);
      const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      req.flash("notice", "Your account has been updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Failed to update your account.");
      res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: req.body,
        messages: req.flash("notice"),
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 * Function to handle password change
 * ************************************ */
async function changePassword(req, res, next) {
  const { account_id, new_password } = req.body;
  let nav = await utilities.getNav();

  try {
    const hashedPassword = bcrypt.hashSync(new_password, 10);
    const changeResult = await accountModel.changePassword(account_id, hashedPassword);

    if (changeResult) {
      const updatedAccountData = await accountModel.getAccountById(account_id);
      const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      req.flash("notice", "Your password has been changed successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Failed to change your password.");
      res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: req.body,
        messages: req.flash("notice"),
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccountView, updateAccount, changePassword };