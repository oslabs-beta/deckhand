const crypto = require('crypto');

// Generate a 32-byte random key for AES-256
const key = crypto.randomBytes(32);
console.log(key.toString('hex'));

// In .env file, set ENCRYPTION_KEY=key (replace key with log value)