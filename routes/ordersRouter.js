const express = require('express');
const ordersRouter = express.Router();

// import orders queries
const ordersQueries = require('../queries/ordersQueries');
// ORDERS TABLE
// get all orders
ordersRouter.get('/', ordersQueries.getOrders);
// get an order by id
ordersRouter.get('/:id', ordersQueries.getOrderById);
// add an order
ordersRouter.post('/', ordersQueries.createOrder);
// update an order
ordersRouter.put('/:id', ordersQueries.updateOrder);
// delete an order
ordersRouter.delete('/:id', ordersQueries.deleteOrder);


module.exports = ordersRouter;