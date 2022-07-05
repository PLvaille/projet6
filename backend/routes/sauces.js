//ici il n'y a que la logique de routing

//appel d'express et de sa methode Router()
const express = require('express');
const router = express.Router();

//middleware d'authentification pour sécuriser les routes
const auth = require('../middleware/auth');
//midleware multer pour la gestion d'image
const multer = require('../middleware/multer-config');
//contolleur des routes
const sauceCtrl = require('../controllers/sauces');

//attention à l'ordre des middleware
//route pour creer une sauce, passe par le middleware auth et multer pour gérer l'image
router.post('/', auth, multer, sauceCtrl.createSauce);
//route pour modifier une sauce correspondant à l'id, également vérification avec auth et maj de l'image avec multer
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//route pour supprimer une sauce grâce à l'id, encore une fois passe par l'auth 
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//route pour obtenir les détails de la sauce correspondant à l'id envoyé
router.get('/:id', auth, sauceCtrl.getOneSauce);
//route pour obtenir l'ensemble des sauces
router.get('/', auth, sauceCtrl.getSauces);

//route pour les likes et dislikes
router.post('/:id/like', auth, sauceCtrl.likesSauces);



module.exports = router;