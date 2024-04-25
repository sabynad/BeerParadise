const express = require('express');

const app = express();

app.use((req, res) => {
    res.json({message: 'La requête est reçue !'});
});

module.exports = app;