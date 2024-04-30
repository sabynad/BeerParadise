const Beer = require ('../models/Beer');

const fs = require('fs');

//; Créer (ajouter) une bière
exports.createBeer = (req, res, next) => {
   const beerObject = JSON.parse(req.body.beer);
   // const beerObject =  req.body
   delete beerObject._id;
    const beer = new Beer({
       ...beerObject,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0
    });
    beer.save()
       .then(() => res.status(201).json({ message: 'Objet enregistré avec succès !' }))
       .catch(error => res.status(400).json({ error }));
 };

  //récupérer toutes les bieres
  exports.getAllBeers = (req, res, next) => {
   Beer.find()
      .then(beers => res.status(200).json(beers))
      .catch(error => res.status(400).json({ error }));
};
  

//; Récupérer une seule bière
exports.getOneBeer = (req, res, next) => {
   Beer.findOne({ _id: req.params.id })
      .then(beer => res.status(200).json(beer))
      .catch(error => res.status(404).json({ error }));
};

//; Modifier et mettre à jour une bière
// exports.modifyBeer = (req, res, next) => {
//    Beer.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//       .then(() => res.status(200).json({ message: 'Produit modifiè avec succès !'}))
//       .catch(error => res.status(400).json({ error }));
// };

//; Modifier et mettre à jour une bière
exports.modifyBeer = (req, res, next) => {
   const beerObject = req.file ? {
      ...JSON.parse(req.body.beer),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

    Beer.updateOne({ _id: req.params.id }, { ...beerObject, _id: req.params.id })
       .then(() => res.status(200).json({ message: 'Produit modifié avec succès !'}))
       .catch(error => res.status(400).json({ error }))};




//; Suppression d'une bière
// exports.deleteBeer = (req, res, next) => {
//    Beer.deleteOne({ _id: req.params.id })
//       .then(() => res.status(200).json({ message: 'Produit supprimé avec succès !'}))
//       .catch(error => res.status(400).json({ error }));
// };

//;  Supprimer une bière
exports.deleteBeer = (req, res, next) => {
   Beer.findOne({ _id: req.params.id})
      .then(beer => {
         const filename = beer.imageUrl.split('/images/')[1];
         fs.unlink(`images/${filename}`, () => {
            Beer.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Votre bière a été supprimée avec succès !'}))
            .catch(error => res.status(400).json({ error }));
         });
      })
      .catch(error => res.status(500).json({ error }));
 };

 // Système de Like et Dislike

exports.likeBeer = (req, res, next) => {
   const userId = req.body.userId;
   const like = req.body.like;
   const beerId = req.params.id;
   Beer.findOne({ _id: beerId })
      .then(beer => {
         // nouvelles valeurs à Modifier
         const newValues = {
            usersLiked: beer.usersLiked,
            usersDisliked: beer.usersDisliked,
            likes: 0,
            dislikes: 0
         }
         // Suivant les cas :
         switch (like) {
            // Lorsque bière est "liké"
            case 1:
               newValues.usersLiked.push(userId);
               break;
            // Lorsque bière "disliké"
            case -1:
               newValues.usersDisliked.push(userId);
               break;
            // lorsque pas d'avis ou annulation du like ou dislike
            case 0:
               if(newValues.usersLiked.includes(userId)) {
                  // Si annulation du like
                  const index = newValues.usersLiked.indexOf(userId);
                  newValues.usersLiked.splice(index, 1);
               } else {
                  // Si annulation du Dislike
                  const index = newValues.usersDisliked.indexOf(userId);
                  newValues.usersDisliked.splice(index, 1);
               }
               break;
         };
         // Calcul du nombre de likes et de dislikes
         newValues.likes = newValues.usersLiked.length;
         newValues.dislikes = newValues.usersDisliked.length;
         // Mise à jour des nouvelles valeurs de la bière
         Beer.updateOne({ _id: beerId }, newValues )
            .then(() => res.status(200).json({ message: 'Note attribuée avec succès à cette bière !' }))
            .catch(error => res.status(500).json({ error }))
      })
      .catch(error => res.status(500).json({ error }));
};