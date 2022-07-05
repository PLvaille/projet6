// definition des routes pour les requetes utilisateur

//import d'express et de sa methode Router
const express = require('express');
const router = express.Router();
//import du user controller, contenant les logiques metiers necessaires aux routes post
const userCtrl = require('../controllers/user');

//import du middle ware verifypw
const verifyPassword = require('../middleware/verifyPassword');

//routes post pour la creation de compte et le login
router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);


//export de ces definitions
module.exports = router;