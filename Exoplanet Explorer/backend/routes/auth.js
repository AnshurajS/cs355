const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authentication');
const auth = require('../authentication/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);

module.exports = router;