const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection and warn if it fails (common during initial setup)
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed. Check your .env settings.');
    console.error('Error details:', err.message);
    console.log('Server will continue to run, but DB features will fail until fixed.');
  });

module.exports = pool;
