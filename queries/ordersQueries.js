const pool = require('./db');

const getOrders = (request, response) => {
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY id ASC', [customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getOrderById = (request, response) => {
  const id = parseInt(request.params.id)
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM orders WHERE id = $1 AND customer_id = $2', [id, customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createOrder = (request, response) => {
  const {
    order_time,
    paid
    } = request.body;
  const customer_id = request.session.customer.id;
  pool.query('INSERT INTO orders (customer_id, order_time, paid) VALUES ($1, $2, $3) RETURNING *', 
    [customer_id, order_time, paid], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    pool.query('INSERT INTO shipments (status, order_id) VALUES ($1, $2)', ['pending', results.rows[0].id], (error, results2) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    })
  })
}

const updateOrder = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    order_time,
    paid
    } = request.body;
  const customer_id = request.session.customer.id;
  pool.query(
    'UPDATE orders SET order_time = $1, paid = $2 WHERE id = $3 AND customer_id = $4 RETURNING *',
    [order_time, paid, id, customer_id],
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
  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }

    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'Order not found.'});
    }

    const customer_id = results.rows[0].customer_id;
    if (customer_id !== request.session.customer.id) {
      return response.status(403).json({ error: 'Invalid customer id.'});
    }
    pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id], (error, results3) => {
        if (error) {
          return response.status(500).json({ error: error.message });
        }
        response.send(results3.rows);
      })
  })
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}