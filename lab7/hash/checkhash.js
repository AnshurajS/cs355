const bcrypt = require('bcrypt');
const fs = require('fs');

const HASH_FILE = 'password.txt';

async function main() {
    const input = process.argv[2];
    const savedHash = fs.readFileSync(HASH_FILE, 'utf8');

    const match = await bcrypt.compare(input, savedHash);
    if (match) console.log('Password is correct!');
    else console.log('Password is incorrect!');
}

main();