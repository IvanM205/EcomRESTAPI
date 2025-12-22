const express = require('express');
const orderItemsRouter = express.Router({ mergeParams: true });

// import orderItems queries
const orderItemsQueries = require('../queries/orderItemsQueries');

// CREATE ORDER ITEMS TABLE
// get all orderItems by order_id
orderItemsRouter.get('/', orderItemsQueries.getCustomerOrderById, orderItemsQueries.getOrderItemsByOrderId);
// add item to order
orderItemsRouter.post('/', orderItemsQueries.checkProductExists, orderItemsQueries.getCustomerOrderById, orderItemsQueries.addItemToOrder);
// update item in order
orderItemsRouter.put('/:product_id', orderItemsQueries.getCustomerOrderById, orderItemsQueries.updateItemInOrder);
// delete item in order
orderItemsRouter.delete('/:product_id', orderItemsQueries.getCustomerOrderById, orderItemsQueries.deleteItemInOrder);

module.exports = orderItemsRouter;