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

// Route to handle registration form submission
// router.post('/register', utilities.handleErrors(accountController.registerAccount));

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
  utilities.handleErrors(accountController.processLogin)
);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

module.exports = router;