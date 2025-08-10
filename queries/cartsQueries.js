const pool = require('./db');

const getCarts = (request, response) => {
  pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getCartById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
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
    updated_at, // timestamp
    customer_id
    } = request.body;

  pool.query('INSERT INTO carts (cart_status, created_at, updated_at, customer_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [cart_status, created_at, updated_at, customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateCart = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    cart_status,
    created_at,
    updated_at,
    customer_id
    } = request.body;

  pool.query(
    'UPDATE carts SET cart_status = $1, created_at = $2, updated_at = $3, customer_id = $4 WHERE id = $5 RETURNING *',
    [cart_status, created_at, updated_at, customer_id, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteCart = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM carts WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

module.exports = {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart
}