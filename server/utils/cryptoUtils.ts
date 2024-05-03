const crypto = require('crypto');
require('dotenv').config();

const secretKey = process.env.ENCRYPTION_KEY || '';

type CryptoUtils = {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
};

const cryptoUtils: CryptoUtils = {
    encrypt: (text: string): string => {
        const iv = crypto.randomBytes(16); // Generate a random IV
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },

    decrypt: (text: string): string => {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift() || '', 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
};

module.exports = cryptoUtils;