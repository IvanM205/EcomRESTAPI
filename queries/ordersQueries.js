const pool = require('./db');

const getOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getOrderById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createOrder = (request, response) => {
  const {
    customer_id,
    order_time,
    paid
    } = request.body;

  pool.query('INSERT INTO orders (customer_id, order_time, paid) VALUES ($1, $2, $3) RETURNING *', 
    [customer_id, order_time, paid], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateOrder = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    customer_id,
    order_time,
    paid
    } = request.body;

  pool.query(
    'UPDATE orders SET customer_id = $1, order_time = $2, paid = $3 WHERE id = $4 RETURNING *',
    [customer_id, order_time, paid, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}