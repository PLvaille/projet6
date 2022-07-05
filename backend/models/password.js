//module password-validator requis
const passwordValidator = require('password-validator');

// Schéma de mot de passe à respecter pour plus de sécurité
const passwordSchema = new passwordValidator();

passwordSchema                                                              // Contraintes
.is().min(8)                                                                // Longueur minimun : 8
.has().uppercase()                                                          // Doit avoir au moins une majuscule
.has().lowercase()                                                          // Doit avoir au moins une minuscule
.has().digits()                                                             // Doit avoir au moins un chiffre
.has().not().spaces()                                                       // Ne doit pas avoir d'espaces 
.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123', 'Qwerty123']);   //  valeurs non autorisées


module.exports = passwordSchema;