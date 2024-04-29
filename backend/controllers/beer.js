const Beer = require ('../models/Beer');


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
exports.modifyBeer = (req, res, next) => {
   Beer.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Produit modifiè avec succès !'}))
      .catch(error => res.status(400).json({ error }));
};


//; Suppression d'un bière
exports.deleteBeer = (req, res, next) => {
   Beer.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Produit supprimé avec succès !'}))
      .catch(error => res.status(400).json({ error }));
};