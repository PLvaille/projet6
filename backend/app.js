//ce fichier défini les fonctions de l'API

//import des élements nécessaires
const express = require('express'); //framework basé sur node.js
const mongoose = require('mongoose'); //bdatabase mongo db
const path = require('path'); //chemin du systeme de fichier

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require('helmet');

//déclaration des routes
const saucesRoutes = require('./routes/sauces'); //pour les sauces
const userRoutes = require('./routes/user.js'); //pour les users

//dotenv pour gerer mongo db sur github
const dotenv = require('dotenv').config('../.env');
// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
//connection à Mongo Db qui va utiliser les parametre de dotenv pour cacher les infos de connexion à mongodb sur github
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//l'app utilise le framework express, qui a besoin d'un 'parser' afin qu'on manipule du json
const app = express();
app.use(express.json());

// Sécuriser Express en définissant divers en-têtes HTTP - https://www.npmjs.com/package/helmet#how-it-works
// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());

//1er middleware qui va créer des en-tetes valides pour les requetes http afin d'éviter des erreurs CORS/CORP
app.use((req, res, next) => {
    //* : tout le monde peut acceder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //quels en-tetes sont acceptés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //quelles méthodes sont acceptés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //quels scripts sont acceptés
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    // paramétre à rajouter pour débloquer les images
    //Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next();
});

//la route statique des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//routage de l'api
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//export de l'app
module.exports = app;

