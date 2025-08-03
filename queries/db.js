require('dotenv').config();
const ecomdbUser = process.env.ECOMDB_USER;
const ecomdbPass = process.env.ECOMDB_PASS;
const PORT = process.env.PORT;

const Pool = require('pg').Pool
const pool = new Pool({
  user: ecomdbUser,
  host: 'localhost',
  database: 'EcomDB',
  password: ecomdbPass,
  port: PORT
});

module.exports = pool;