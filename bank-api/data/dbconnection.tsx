const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  // ///////////// user and password from local postgreSQL database
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  // database - name of database in local postgreSQL database
  database: process.env.PGDATABASE,
});

module.exports = pool;
