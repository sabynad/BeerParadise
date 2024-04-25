const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
c

// Middleware pour s'incrire
router.post('/signup', userCtrl.signup );

// Middleware pour se connecter
router.post('/login', userCtrl.login);

module.exports = router;