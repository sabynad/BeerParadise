
const express = require('express');


const app = express();

//mongodb+srv://<username>:<password>@cluster0.onxquvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://latyty:projetbeer@cluster0.stcfyux.mongodb.net/db_test?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//..importation de router.......
const path = require('path');
app.use('/images', express.static(path.join(__dirname,'images')));

const userRoutes = require('./routes/users');
app.use('/api/auth', userRoutes);

const beerRoutes = require('./routes/beers');
app.use('/api/beers', beerRoutes);





module.exports = app;