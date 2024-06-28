// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to trigger a 500 error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional error triggered!"));
  });

module.exports = router;