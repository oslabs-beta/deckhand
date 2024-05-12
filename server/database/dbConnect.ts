const { Pool } = require('pg')

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'production'
      ? process.env.PG_URI_PROD
      : process.env.PG_URI
})

module.exports = {
  query: (text: any, params: any, callback: any) => {
    // console.log('Executed query: ', text);
    return pool.query(text, params, callback)
  }
}
