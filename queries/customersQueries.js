const pool = require('./db');

const getCustomers = (request, response) => {
  pool.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getCustomerById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM customers WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createCustomer = (request, response) => {
  const {
    username,
    first_name,
    last_name,
    email,
    phone,
    address
    } = request.body;

  pool.query('INSERT INTO customers (username, first_name, last_name, email, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
    [username, first_name, last_name, email, phone, address], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const updateCustomer = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    username,
    first_name,
    last_name,
    email,
    phone,
    address
    } = request.body;

  pool.query(
    'UPDATE customers SET username = $1, first_name = $2, last_name = $3, email = $4, phone = $5, address = $6  WHERE id = $7 RETURNING *',
    [username, first_name, last_name, email, phone, address, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }
      response.send(results.rows);
    }
  )
}

const deleteCustomer = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
}