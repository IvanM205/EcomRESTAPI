const pool = require('./db');

const getCarts = (request, response) => {
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM carts WHERE customer_id = $1 ORDER BY id ASC', [customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getCartById = (request, response) => {
  const id = parseInt(request.params.id)
  const customer_id = request.session.customer.id;
  pool.query('SELECT * FROM carts WHERE customer_id = $1 AND id = $2', [customer_id, id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createCart = (request, response) => {
  const {
    cart_status, // active, pending, completed
    created_at, // timestamp
    updated_at // timestamp
    } = request.body;
  const customer_id = request.session.customer.id;
  pool.query('INSERT INTO carts (cart_status, created_at, updated_at, customer_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [cart_status, created_at, updated_at, customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateCart = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    cart_status,
    created_at,
    updated_at
    } = request.body;
  const customer_id = request.session.customer.id;
  pool.query(
    'UPDATE carts SET cart_status = $1, created_at = $2, updated_at = $3 WHERE id = $4 AND customer_id = $5 RETURNING *',
    [cart_status, created_at, updated_at, id, customer_id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteCart = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }

    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'Cart not found.' });
    }

    const customer_id = results.rows[0].customer_id;
    if (customer_id !== request.session.customer.id) {
      return response.status(403).json({ error: 'Invalid customer id.'});
    }

    pool.query('DELETE FROM carts WHERE id = $1 RETURNING *', [id], (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
    );
  });
}

module.exports = {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart
}