const express = require('express');
const cartItemsRouter = express.Router({ mergeParams: true });

// import cartItems queries
const cartItemsQueries = require('../queries/cartItemsQueries');

// CARTS ITEMS TABLE
// get all cartItems by cart_id
cartItemsRouter.get('/', cartItemsQueries.getCustomerCartById, cartItemsQueries.getCartItemsByCartId);
// add item to cart
cartItemsRouter.post('/', cartItemsQueries.checkProductExists, cartItemsQueries.getCustomerCartById, cartItemsQueries.addItemToCart);
// update item in cart
cartItemsRouter.put('/:product_id', cartItemsQueries.getCustomerCartById, cartItemsQueries.updateItemInCart);
// delet item from cart
cartItemsRouter.delete('/:product_id', cartItemsQueries.getCustomerCartById, cartItemsQueries.deleteItemInCart);

module.exports = cartItemsRouter;