const db = require('./dbConnect');

module.exports = {
  dbInit: async () => {
    await db.query(`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  --Drop existing tables if they exist
  --DROP TABLE IF EXISTS users CASCADE;

  -- Create tables
  CREATE TABLE IF NOT EXISTS users (
    _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatarurl VARCHAR(255) DEFAULT NULL,
    githubid VARCHAR(255) DEFAULT NULL,
    theme VARCHAR(255) DEFAULT 'light',
    awsaccesskey VARCHAR(255) DEFAULT NULL,
    awssecretkey VARCHAR(255) DEFAULT NULL,
    state JSONB DEFAULT NULL
  );
`);
  }
}