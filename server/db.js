const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
client.connect()
  .then(() => (console.log('connected to database')))
  .catch((err) => (console.log(err)));

module.exports = client;
