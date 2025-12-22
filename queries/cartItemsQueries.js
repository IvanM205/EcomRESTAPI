const pool = require('./db');

const getCustomerCartById = (request, response, next) => {
  const id = parseInt(request.params.id)
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM carts WHERE customer_id = $1 AND id = $2', [customer_id, id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    if (!results.rows[0]) {
      return response.status(404).json({ error: 'Cart not found' });
    }
    const cart = results.rows[0];
    request.cart = cart;
    next();
  })
}

const getCartItemsByCartId = (request, response) => {
  const cart = request.cart;
  pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart.id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    if (!results.rows[0]) {
      return response.status(404).json({ error: 'Items not found' });
    }
    response.send(results.rows);
  })
}

const checkProductExists = (request, response, next) => {
  const {
    product_id
  } = request.body;
  pool.query('SELECT * FROM products WHERE id = $1', [product_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    if (!results.rows[0]) {
      return response.status(404).json({ error: 'Product not found' });
    }
    next();
  })
}

const addItemToCart = (request, response) => {
  const {
    product_id,
    quantity
    } = request.body;
  
  const cart = request.cart;
  pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', 
    [cart.id, product_id, quantity], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateItemInCart = (request, response) => {
  const {
    quantity
    } = request.body;
  const { product_id } = request.params;
  const cart = request.cart;
  pool.query(
    'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
    [quantity, cart.id, product_id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteItemInCart = (request, response) => {
  const { product_id } = request.params;
  const cart = request.cart;
  pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *', [cart.id, product_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  }
  );
}

module.exports = {
  getCustomerCartById,
  getCartItemsByCartId,
  checkProductExists,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart
}