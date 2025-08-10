const express = require('express');
const productsRouter = express.Router();

// import products queries
const productsQueries = require('../queries/productsQueries');

// PRODUCTS TABLE
// get all products
productsRouter.get('/', productsQueries.getProducts);
// get a product by id
productsRouter.get('/:id', productsQueries.getProductById);
// add a product 
productsRouter.post('/', productsQueries.createProduct);
// update a product
productsRouter.put('/:id', productsQueries.updateProduct);
// delete a product
productsRouter.delete('/:id', productsQueries.deleteProduct);


module.exports = productsRouter;