//middleware d'authentification des requetes des users

//import du package jwt
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //on recup le token de la partie authorization du header de la requete
    const token = req.headers.authorization.split(' ')[1];
    //on décode avec la methode verify et la clé secrète initialisée dans controllers/user
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    //en theorie on a alors l'id de l'user
    const userId = decodedToken.userId;
    req.auth = { userId };
    //on verifie que l'id de l'user existe et qu'il est bien identique à celui encodé dans la requete
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'; //si ce n'est pas le bon user Id
    } else {
      next(); //si l'id est validé
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};