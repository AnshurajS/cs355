const Datastore = require('nedb-promises');

// Single users database
const usersDB = Datastore.create({ filename: 'data/users.db', autoload: true });

module.exports = { usersDB };