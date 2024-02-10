// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');

// Generate a 32-byte random key for AES-256
// @ts-expect-error TS(2339): Property 'randomBytes' does not exist on type 'Cry... Remove this comment to see the full error message
const key = crypto.randomBytes(32);
console.log(key.toString('hex'));

// In .env file, set ENCRYPTION_KEY=key (replace key with log value)