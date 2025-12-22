const express = require('express');
const productsRouter = express.Router();

// import products queries
const productsQueries = require('../queries/productsQueries');

// PRODUCTS TABLE
// get all products
productsRouter.get('/', productsQueries.getProducts);
// get a product by id
productsRouter.get('/:id', productsQueries.getProductById);



module.exports = productsRouter;