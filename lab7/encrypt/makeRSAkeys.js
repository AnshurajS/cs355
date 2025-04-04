const crypto = require('crypto');
const fs = require('fs');

const PUBLIC_KEY_FILE = 'public_key.pem';
const PRIVATE_KEY_FILE = 'private_key.pem';

function generateAndSaveRSAKeys(publicKeyPath, privateKeyPath) {
    const { publicKey, privateKey } =
        crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log(`Public key saved to ${publicKeyPath}`);
    console.log(`Private key saved to ${privateKeyPath}`);
}

generateAndSaveRSAKeys(PUBLIC_KEY_FILE, PRIVATE_KEY_FILE);