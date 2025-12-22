const express = require('express');
const customersRouter = express.Router();

// import customers queries
const customersQueries = require('../queries/customersQueries');

// CUSTOMERS TABLE
// get a self customer data
customersRouter.get('/', customersQueries.getCustomerById);
// update a customer
customersRouter.put('/', customersQueries.updateCustomer);
// delete a customer
//customersRouter.delete('/', customersQueries.deleteCustomer);


module.exports = customersRouter;