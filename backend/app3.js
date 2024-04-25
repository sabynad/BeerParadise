const express = require('express');

const app = express();

app.use((req, res, next) => {
   console.log("Requête est reçue !");
   next();
});

app.use((req, res, next) => {
  res.status(201);
   next();
});

app.use((req, res, next) => {
  res.json({message:'La requête a bien été reçue !'});
   next();
});

app.use((req, res, next) => {
 console.log('Réponse envoyée avec succès !');
 });

module.exports = app;