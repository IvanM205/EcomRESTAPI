const express = require('express');
const customersRouter = express.Router();

// import customers queries
const customersQueries = require('../queries/customersQueries');

// CUSTOMERS TABLE
// get all customers
customersRouter.get('/', customersQueries.getCustomers);
// get a customer by id
customersRouter.get('/:id', customersQueries.getCustomerById);
// add a customer 
customersRouter.post('/', customersQueries.createCustomer);
// update a customer
customersRouter.put('/:id', customersQueries.updateCustomer);
// delete a customer
customersRouter.delete('/:id', customersQueries.deleteCustomer);


module.exports = customersRouter;