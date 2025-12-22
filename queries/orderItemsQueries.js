const pool = require('./db');

const getCustomerOrderById = (request, response, next) => {
  const id = parseInt(request.params.id)
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM orders WHERE customer_id = $1 AND id = $2', [customer_id, id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    if (!results.rows[0]) {
      return response.status(404).json({ error: 'Order not found' });
    }
    const order = results.rows[0];
    request.order = order;
    next();
  })
}

const getOrderItemsByOrderId = (request, response) => {
  const order = request.order;
  pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id], (error, results) => {
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

const addItemToOrder = (request, response) => {
  const {
    product_id,
    quantity
    } = request.body;
  
  const order = request.order;
  pool.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', 
    [order.id, product_id, quantity], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateItemInOrder = (request, response) => {
  const {
    quantity
    } = request.body;
  const { product_id } = request.params;
  const order = request.order;
  pool.query(
    'UPDATE order_items SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *',
    [quantity, order.id, product_id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteItemInOrder = (request, response) => {
  const { product_id } = request.params;
  const order = request.order;
  pool.query('DELETE FROM order_items WHERE order_id = $1 AND product_id = $2 RETURNING *', [order.id, product_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  }
  );
}

module.exports = {
  getCustomerOrderById,
  getOrderItemsByOrderId,
  checkProductExists,
  addItemToOrder,
  updateItemInOrder,
  deleteItemInOrder
}