const express = require('express');
const router = express.Router();
const { fetchPlanets, addFavorite, removeFavorite, getFavorites } = require('../controllers/exoplanetFetch');
const auth = require('../authentication/auth');

router.get('/', fetchPlanets);
router.get('/favorites', auth, getFavorites);
router.post('/favorites', auth, addFavorite);
router.delete('/favorites/:pl_name', auth, removeFavorite);

module.exports = router;