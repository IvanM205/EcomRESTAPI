const pool = require('./db');

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getProductById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createProduct = (request, response) => {
  const {
    title,
    description,
    price,
    supplier_id
    } = request.body;

  pool.query('INSERT INTO products (title, description, price, supplier_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [title, description, price, supplier_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    title,
    description,
    price,
    supplier_id
    } = request.body;

  pool.query(
    'UPDATE products SET title = $1, description = $2, price = $3, supplier_id = $4 WHERE id = $5 RETURNING *',
    [title, description, price, supplier_id, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}