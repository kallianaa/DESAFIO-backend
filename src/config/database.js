// src/config/database.js
const path = require('path'); // <-- Faltava esta linha
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // <-- Ajuste aqui
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};