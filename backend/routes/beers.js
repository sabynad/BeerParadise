const express = require('express');
const router = express.Router();
const beerCtrl = require('../controllers/beer');

const auth = require('../middleware/auth');



//implemente l'authentification par token et est correctement sécurisée.
// router.post('/',auth , beerCtrl.createBeer );

//: Route pour récupérer toutes les bières
router.get('/',auth, beerCtrl.getAllBeers);

//: Route pour récupérer une seule bière
router.get('/:id', auth, beerCtrl.getOneBeer);

//: Route pour modifier et mettre à jour une bière
router.put('/:id', auth, beerCtrl.modifyBeer);

//:  Route pour supprimer une bière
router.delete('/:id', auth, beerCtrl.deleteBeer);

//pour les images
//; Importation du middleware multer-config
const multer = require('../middleware/multer-config');

//: Route pour créer ou ajouter une bière
router.post('/',auth, multer, beerCtrl.createBeer );


module.exports = router;
