// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');
require('dotenv').config();

const secretKey = process.env.ENCRYPTION_KEY;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cryptoUtil... Remove this comment to see the full error message
const cryptoUtils = {};

// Encrypt function
cryptoUtils.encrypt = function (text: any) {
  // @ts-expect-error TS(2339): Property 'randomBytes' does not exist on type 'Cry... Remove this comment to see the full error message
  const iv = crypto.randomBytes(16); // Generate a random IV
  // @ts-expect-error TS(2339): Property 'createCipheriv' does not exist on type '... Remove this comment to see the full error message
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Decrypt function
cryptoUtils.decrypt = function (text: any) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  // @ts-expect-error TS(2339): Property 'createDecipheriv' does not exist on type... Remove this comment to see the full error message
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = cryptoUtils;