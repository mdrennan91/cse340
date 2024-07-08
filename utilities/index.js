const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building navigation:", error);
    throw error;
  }
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '';
  if(data && data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid +=  `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail || '/path/to/default/image.png'}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"></a>`;
      grid += '<div class="namePrice">';
      grid += '<hr>';
      grid += `<h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`;
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(data){
  if (!data) {
    return '<p class="notice">Vehicle not found.</p>';
  }
  
  let detail = `
    <div class="vehicle-detail">
      <img src="${data.inv_image || '/path/to/default/image.png'}" alt="Image of ${data.inv_make} ${data.inv_model}">
      <div class="vehicle-info">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Year:</strong> ${data.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
      </div>
    </div>
  `;
  return detail;
};

/* **************************************
 * Build the classification list HTML
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
      if (err) {
        req.flash("notice", "Please log in.")
        res.clearCookie("jwt")
        res.locals.loggedin = false;
        res.locals.accountData = null;
        return next();
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = true;
      next();
    });
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    next();
  }
};


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
// Middleware to check token validity and account type
**************************************** */
 Util.checkAdmin = (req, res, next) => {
  console.log('Checking admin access...');
  if (res.locals.accountData && (res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'Employee')) {
    next();
  } else {
    console.log('Access denied: insufficient permissions');
    req.flash("notice", "You do not have permission to access this page.");
    res.redirect("/account/login");
  }
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
      if (err) {
        req.flash("notice", "Please log in.")
        res.clearCookie("jwt")
        res.locals.loggedin = false;
        res.locals.accountData = null;
        return next();
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = true;
      next();
    });
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    next();
  }
};

module.exports = Util