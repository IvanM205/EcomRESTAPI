const pool = require('./db');
const bcrypt = require('bcrypt');

// Function to hash passwords
const hashPassword = async (plainPassword) => {
  const saltRounds = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
}

const getPassHashes = (request, response) => {
  pool.query('SELECT * FROM passwords ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const getPassHashById = (request, response) => {
  const customer_id = parseInt(request.params.id)

  pool.query('SELECT * FROM passwords WHERE id = $1', [customer_id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.send(results.rows);
  })
}

const createPassHash = async (request, response) => {
  const {
    username, 
    email,
    hashed_password
  } = request.body;

  try {
    const customer_id = request.customer.id;
    const password_hash = hashed_password;
    const updated_at = new Date();
    const results = await pool.query('INSERT INTO passwords (customer_id, password_hash, updated_at) VALUES ($1, $2, $3) RETURNING customer_id, updated_at',
      [customer_id, password_hash, updated_at]);
    response.status(201).json(
      {
        success: true,
        msg: 'User registrated succesfullz',
        user: 
          {
            username,
            email
          }
      });
  } catch (error) {
    console.error('Error creating password hash:', error);
    response.status(500).json({ error: error.message });
  }
}

const getCustomerByUsername = (request, response, next) => {
  const { username } = request.body;
  pool.query('SELECT * FROM customers WHERE username = $1', [username], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message});
    }
    const customer = results.rows[0];
    //console.log(customer);
    if (!customer) {
      return response.status(404).json({error: "Customer was not found!"});
    } else {
      request.customer = customer;
      next();
    }
  });
};
  
const checkCustomerByUsername = (request, response, next) => {
  const { username, hashed_password } = request.body;
  pool.query('SELECT * FROM customers WHERE username = $1', [username], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message});
    }
    const customer = results.rows[0];
    //console.log(customer);
    if (!customer) {
      next();
    } else {
      return response.status(409).json({ msg: 'Customer already exists!'});
    }
  });
};

const requestLogin = async (request, response, next) => {
  const { username, password } = request.body;
  pool.query('SELECT (password_hash) FROM passwords WHERE customer_id = $1', [request.customer.id], async (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message});
    }
    const { password_hash } = results.rows[0];
    // Compare hashes
    const isValidPassword = await bcrypt.compare(password, password_hash);
    if (!isValidPassword) {
      return response.status(401).json({ error: "Invalid credentials" });
    }
    request.session.authenticated = true;
    request.session.customer = {
        username,
        password,
    };
      response.send(`Customer ${request.session.customer.username} has loged in sucessfully!`);
  });
};

const requestLogout = (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.status(500).json({ msg: err.message })
    }
    response.json({msg: 'Logged out sucessfully!'});
  })
};

const requestRegistration = async (request, response, next) => {
  try {
    const { username, first_name, last_name, email, phone, address, password, confirm_password} = request.body;
    
    if (!username || !first_name || !last_name || !email || !phone || !address || !password || !confirm_password) {
      return response.status(400).json({ msg: 'All fields are required!'});
    }

    if (password !== confirm_password) {
      return response.status(400).json( { msg: 'Passwords don\'t match' });
    }

    if (password.length < 6 ) {
      return response.status(400).json({ msg: 'Password must be at least 6 characters long'});
    }

    const hashed_password = await hashPassword(password);

    const newCustomer = {
      username,
      first_name,
      last_name,
      email,
      phone,
      address,
      hashed_password
    };
    request.body = newCustomer;
    console.log(request.body);
    next();
  } catch(err) {
    console.error('Registration error:', err);
    response.status(500).json({ msg: 'Server error during registration' });
  }
};

module.exports = {
  hashPassword,
  getPassHashes,
  getPassHashById,
  createPassHash,
  getCustomerByUsername,
  checkCustomerByUsername,
  requestLogin,
  requestLogout,
  requestRegistration
};