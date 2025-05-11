const { usersDB } = require('../config/db');

module.exports = {
  findByEmail: email => usersDB.findOne({ email }),
  findById: id => usersDB.findOne({ _id: id }),
  create: user => usersDB.insert(user),
  updateFavorites: (id, favs) => usersDB.update({ _id: id }, { $set: { favorites: favs } })
};