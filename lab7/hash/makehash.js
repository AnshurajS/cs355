const bcrypt = require('bcrypt');
const fs = require('fs');

const HASH_FILE = 'password.txt';

const SALT_ROUNDS = 10;

async function main(){
    const password = process.argv[2];
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    fs.writeFileSync(HASH_FILE, hashedPassword);
}

main();