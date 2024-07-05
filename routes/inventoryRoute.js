// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to display inventory management view
router.get("/", invController.buildManagementView);

// Route to display add classification form
router.get("/add-classification", invController.buildAddClassificationView);

// Route to handle add classification form submission
router.post("/add-classification", validate.addClassificationRules(), validate.checkClassificationData, invController.addClassification);

// Route to display add inventory form
router.get("/add-inventory", invController.buildAddInventoryView);

// Route to handle add inventory form submission
router.post("/add-inventory", validate.addInventoryRules(), validate.checkInventoryData, invController.addInventory);

// Route to display delete classification form
router.get("/delete-classification", invController.buildDeleteClassificationView);

// Route to handle delete classification form submission
router.post("/delete-classification", validate.deleteClassificationRules(), validate.checkDeleteClassificationData, invController.deleteClassification);

// Route to trigger a 500 error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional error triggered!"));
  });

module.exports = router;