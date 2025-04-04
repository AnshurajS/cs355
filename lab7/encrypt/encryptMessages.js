const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const SYM_KEY_LEN = 16;
const ASYM_HASH = 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

const PUBLIC_KEY_FILE = 'public_key.pem';
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_FILE);

function encrypt(text,key,iv){
    let cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}

function encryptPub(txt, publicKey){
    const encryptedBuffer = crypto.publicEncrypt({
        key: publicKey,
        padding: ASYM_PAD,
        hash: ASYM_HASH
    }, Buffer.from(txt));
    return encryptedBuffer.toString('base64');
    // base64 enables us to store data as text (for json/text data )
}

const key = crypto.randomBytes(SYM_KEY_LEN);
const iv = crypto.randomBytes(16); // AES block size is 16 bytes

let eKey = encryptPub(key, PUBLIC_KEY);
let eIv = encryptPub(iv, PUBLIC_KEY);

let phrases=[
    'Hello world!',
    'This is a secret message.',
    'Encrypt me!',
    'Node.js is awesome!',
    'I love programming!'
]

let encryptedTxt=phrases.map(m=> encrypt(m,key,iv));    

const doc = {
    key: eKey,
    iv: eIv,
    data: encryptedTxt
}

fs.writeFileSync('msg.json', JSON.stringify(doc, null, 2));