// On prend toute la logique métier pour la déporter dans le fichier sauce.js de controllers
// On ne garde que la logique de routing dans le fichier sauce.js du router. On importe aussi le model Sauce
// On a ajouté le controller sauce avec une constante sauceCtrl dans le fichier sauce.js du router

//on récupère le model de sauce mongoose à utiliser, définit dans models/sauce
const Sauce = require('../models/sauce');

//appel de filesystem de node pour gerer les images
const fs = require('fs');


//---------- CRUD ------------
//creation d'une sauce
exports.createSauce = (req, res, next) => {
  //on parse le body reçu en JSON pour le manipuler grace à la variable sauceObject
  const sauceObject = JSON.parse(req.body.sauce);
  //on supprime l'id car c'est mongo db qui va le générer
  delete sauceObject._id;
  //on créer une nouvelle sauce avec le model précédement importé
  const sauce = new Sauce({
    //... = opérateur spread = copie la req.body
    ...sauceObject,
    //l'image sera enregistré de maniere dynamique ex : "http://localhost:3000/images/sauce_tim3st4mp.jpg"
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    //le reste sera vide par défaut
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  //sauvegarde dans la bd 
  sauce.save()
    //comme c'est une promise il lui faut un status si tout va bien
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    // et en cas d'erreur
    .catch(error => res.status(400).json({ error }));

};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    //operateur ternaire '?' {condition-True} : {condition-False}
    //true
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //false
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(
      (sauce) => {
        if (!sauce) {
          res.status(404).json({ error: new Error('No such Sauce!') });
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({ error: new Error('Unauthorized request!') });
        }
        //console.log(sauce.imageUrl);
        const filename = sauce.imageUrl.split('/images/')[1];
        //console.log(filename);
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !!!!' }))
            .catch(error => res.status(400).json({ error }));
        });
      })
};

//recupérer une sauce, methode findOne, utilise _id:
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//récupérer toutes les sauces, methode find
exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//gérer les likes des sauces
exports.likesSauces = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  //requette = mettre un like

  if (like === 1) {
    //mettre a jour la sauce concerné, ajouter l'user à l'array usersLiked avec $push, incrémenter les likes de 1 avec methode $inc, inclue dans mongodb
    Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
      .then(() => res.status(200).json("sauce liké !"))
      .catch(error => res.status(400).json({ error }));
  }

  //requette = mettre un dislike
  if (like === -1) {
    //maj la sauce, ajouter l'user à l'array usersDisliked, incrément les dislikes de 1
    Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
      .then(() => res.status(200).json("sauce disliké"))
      .catch(error => res.status(400).json({ error }));
  }

  //requette annuler son like/dislike
  if (like === 0) {
    //trouver la sauce
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        //si l'utilisateur était dans l'array userLiked, il annule son like
        if (sauce.usersLiked.includes(userId)) {
          //maj de la sauce, on enleve l'user de l'array $pull, et on décrémente les likes
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
            .then(() => res.status(200).json("like retiré"))
            .catch(error => res.status(400).json({ error }));
        }
        //si l'user était dans l'array des dislike, il annule son dislike
        else if (sauce.usersDisliked.includes(userId)) {
          //maj de la sauce, on enleve l'user de l'array des dislike, décrément des dislike
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
            .then(() => res.status(200).json("dislike retiré"))
            .catch(error => res.status(400).json({ error }));
        }
      })
      //sauce introuvable 404
      .catch(error => res.status(404).json({ error }));
  }
};