const express = require('express');
const router = express.Router();
const beerCtrl = require('../controllers/beer');

const auth = require('../middleware/auth');

//pour les images
//; Importation du middleware multer-config
const multer = require('../middleware/multer-config');


//: Route pour récupérer toutes les bières
router.get('/',auth, beerCtrl.getAllBeers);

//: Route pour récupérer une seule bière
router.get('/:id', auth, beerCtrl.getOneBeer);

//: Route pour modifier et mettre à jour une bière
// router.put('/:id', auth, beerCtrl.modifyBeer);
router.put('/:id', auth, multer, beerCtrl.modifyBeer);     //fait crashe le server

//:  Route pour supprimer une bière
router.delete('/:id', auth, beerCtrl.deleteBeer);


//: Route pour créer ou ajouter une bière
router.post('/',auth, multer, beerCtrl.createBeer );


//: Route pour liker/ disliker une bière
router.post('/:id/like', auth, beerCtrl.likeBeer);

module.exports = router;
