 // il faut importer express en permier puis router, l'ordre est tres important........
 const express = require('express');
 const router = express.Router();
 
 const userCtrl = require('../controllers/user');
 
 
 // Middleware pour s'incrire
 router.post('/signup', userCtrl.signup );
 
 // Middleware pour se connecter
 router.post('/login', userCtrl.login);
 
 module.exports = router;