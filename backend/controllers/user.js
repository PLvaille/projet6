// On retrouve ici les logiques métier en lien avec nos utilisateurs,
// appliqué aux routes POST pour les opérations d'inscription et de connexion

//import du package de hashage bcrypt
const bcrypt = require('bcrypt');
//definition de User qui doit correspondre au models/user
const User = require('../models/user');
//import de jwt pour les tokens
const jwt = require('jsonwebtoken');

//controlleur de création de compte utilisateur
exports.signup = (req, res, next) => {
    //on hash le password envoyé dans le body, 10 tours d'algo
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //creation d'un utilisateur avec son mail contenu dans le body de la req et le hash défnit ci dessus
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //sauvegarde de l'utilisatieur adns la bd
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};

//controlleur de login
exports.login = (req, res, next) => {
    //on cherche dans l'email de la requete dans la bd
    User.findOne({ email: req.body.email })
        .then(user => {
            //si l'user n'existe pas 
            if (!user) {
                res.writeHead(401, "utilisateur non trouvé !!!", {
                    'content-type' : 'text/plain'
                    //text/html , text/plain, application/json
                });
                return res.end('utilisateur non trouvé');
               // return res.status(401).json({ message: 'Utilisateur non trouvé !' });
            }
            //sinon on compare les hash des mdp
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //si mdp invalide
                    if (!valid) {
                        res.writeHead(401, "Mot de passe érroné !", {
                            'content-type' : 'text/plain'
                            //text/html , text/plain, application/json
                        });
                        return res.end('Mauvais mot de passe');
                        //return res.status(401).json({ message : "Mot de passe incorrect !" });
                    }
                    //sinon on attribu un token à l'utilisateur pour 24h en utilisant la clé 'RANDOM_TOKEN_SECRET'
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};