const express = require('express');
const authRouter = express.Router();

// import auth queries
const authQueries = require('../queries/authQueries');
// import customers queries
const customersQueries = require('../queries/customersQueries');

// passwords TABLE
// POST request for logging in
authRouter.post("/login", authQueries.getCustomerByUsername, authQueries.requestLogin);
// POST request for log out
authRouter.post("/logout", authQueries.requestLogout);
// POST request for registration
authRouter.post("/register", authQueries.checkCustomerByUsername, authQueries.requestRegistration, customersQueries.createCustomer, authQueries.getCustomerByUsername, authQueries.createPassHash);

module.exports = authRouter;