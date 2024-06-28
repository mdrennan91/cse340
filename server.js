/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute.js")
const utilities = require("./utilities/"); 


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)


// Index Route
// app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
 * File Not Found Route - must be last route in list
 *************************/
app.use(async (req, res, next) => {
  let nav = await utilities.getNav();
  next({ status: 404, message: 'Sorry, we appear to have lost that page.', nav });
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  const { status = 500, message, nav } = err; 
  console.error(`Error at: "${req.originalUrl}": ${message}`);
  const errorMessage = status === 404 ? message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(status).render("errors/error", {
    title: status === 404 ? "404 - File Not Found" : "Server Error",
    message: errorMessage,
    nav
  });
});
