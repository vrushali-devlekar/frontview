// utils/crypto.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
let warnedAboutDerivedKey = false;

const getMasterKey = () => {
    const rawValue = String(process.env.ENCRYPTION_KEY || '').trim();

    if (!rawValue) {
        throw new Error('Missing ENCRYPTION_KEY');
    }

    const compactValue = rawValue.replace(/\s+/g, '');

    if (/^[0-9a-fA-F]{64}$/.test(compactValue)) {
        return Buffer.from(compactValue, 'hex');
    }

    try {
        const base64Buffer = Buffer.from(rawValue, 'base64');
        if (base64Buffer.length === 32) {
            return base64Buffer;
        }
    } catch (error) {
        // ignore and fall back to deterministic derivation below
    }

    if (!warnedAboutDerivedKey) {
        warnedAboutDerivedKey = true;
        console.warn('[crypto] ENCRYPTION_KEY is not a valid 32-byte hex/base64 key. Deriving a stable 32-byte key from the provided value.');
    }

    return crypto.createHash('sha256').update(rawValue, 'utf8').digest();
};

const encrypt = (plainText) => {
    // 16-byte ka random IV (Initialization Vector)
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, getMasterKey(), iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return {
        encryptedValue: encrypted,
        iv: iv.toString('base64')
    };
};

const decrypt = (encryptedValue, ivBase64) => {
    try {
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv(algorithm, getMasterKey(), iv);
        
        let decrypted = decipher.update(encryptedValue, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error("Decryption failed. Data might be corrupted or key is wrong.");
        return null;
    }
};

module.exports = { encrypt, decrypt };
