const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = "P4lm4sD0r4d4s"

function encrypt(text) {
    key = crypto.createCipher(algorithm, password);
    let encrypted = key.update(text, 'utf8', 'hex');
    encrypted += key.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    key = crypto.createDecipher(algorithm, password);
    let decrypted = key.update(encrypted, 'hex', 'utf8');
    decrypted += key.final('utf8');
    return decrypted;
}

module.exports= {
	encrypt, decrypt
}
