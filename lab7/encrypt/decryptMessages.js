const crypto = require('crypto');
const fs = require('fs');

const PRIVATE_KEY_FILE = 'private_key.pem';
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_FILE);

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_HASH = 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

function decrypt(text, key, iv){
    let encryptedText = Buffer.from(text, 'base64');
    let decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function decryptPriv(encrypted864, privateKey) {
    const decryptedBuffer = crypto.privateDecrypt({
        key: privateKey,
        padding: ASYM_PAD,
        hash: ASYM_HASH
    }, Buffer.from(encrypted864, 'base64'));
    return decryptedBuffer;
    // base64 enables us to store data as text (for json/text data )
}

const messageFile = 'msg.json';
const doc = JSON.parse(fs.readFileSync(messageFile));

let key=decryptPriv(doc.key,PRIVATE_KEY);
let iv=decryptPriv(doc.iv,PRIVATE_KEY);

console.log('Decrypted:');
for(let txt of doc){
    console.log(decrypt(txt, key, iv));
}