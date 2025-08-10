const express = require('express');
const cartsRouter = express.Router();

// import carts queries
const cartsQueries = require('../queries/cartsQueries');

// CARTS TABLE
// get all carts
cartsRouter.get('/', cartsQueries.getCarts);
// get a cart by id
cartsRouter.get('/:id', cartsQueries.getCartById);
// add a cart
cartsRouter.post('/', cartsQueries.createCart);
// update a cart
cartsRouter.put('/:id', cartsQueries.updateCart);
// delete a cart
cartsRouter.delete('/:id', cartsQueries.deleteCart);


module.exports = cartsRouter;