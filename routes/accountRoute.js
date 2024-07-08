// Require Statements
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to handle "My Account" login link click
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle registration link click
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to handle login form submission
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))


// Route for logout
router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  req.flash('notice', 'You have been logged out.');
  res.redirect('/');
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


module.exports = router;