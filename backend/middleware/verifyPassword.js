
//import du model de mot de pass qui devra être respecté
const passwordSchema = require('../models/password');

// vérifie que le mot de passe respecte le schema décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        //res.status(400).json({ message : "Mot de passe requis : 8 caractères, 1 majuscule, 1 minuscule, sans espaces"})
        res.writeHead(400, "Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces", {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
        
    } else {
        next();
    }
};