// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");


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

// Route to fetch inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to handle inventory update form submission
router.post("/update", validate.addInventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to display delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to handle delete inventory form submission
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Administrative routes (Apply checkAdmin middleware)
router.get("/", utilities.checkAdmin, utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.checkAdmin, utilities.handleErrors(invController.buildAddClassificationView));
router.post("/add-classification", utilities.checkAdmin, validate.addClassificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.checkAdmin, utilities.handleErrors(invController.buildAddInventoryView));
router.post("/add-inventory", utilities.checkAdmin, validate.addInventoryRules(), validate.checkInventoryData, utilities.handleErrors(invController.addInventory));

router.get("/edit/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.editInventoryView));
router.post("/update", utilities.checkAdmin, validate.addInventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

router.get("/delete/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.buildDeleteConfirmationView));
router.post("/delete", utilities.checkAdmin, utilities.handleErrors(invController.deleteInventoryItem));

// Route to fetch inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));




// Route to trigger a 500 error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional error triggered!"));
  });


// Export the router
module.exports = router;