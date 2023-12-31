const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'production' ? process.env.PG_URI_PROD : process.env.PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    // console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};