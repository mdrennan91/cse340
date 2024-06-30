// Require Statements
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to handle "My Account" login link click
router.get("/login", accountController.buildLogin);

// Route to handle registration link click
router.get("/register", accountController.buildRegister);

// Route to handle registration form submission
router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

module.exports = router;