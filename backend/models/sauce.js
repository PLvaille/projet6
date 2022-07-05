//import de mongoose, on va utiliser la methode schema qui est fourni
const mongoose = require('mongoose');
//plugin d'assainissement 
const sanitizerPlugin = require('mongoose-sanitizer-plugin');


//definition du schema de données du model mongooe à utiliser
const sauceSchema = mongoose.Schema({
  //on va définir chaque type de donnée pour chaque objet du schema et indiquer s'il est obligatoire lors de la création (required)
  //id de l'user
  userId: { type: String, required: true },
  //nome de la sauce
  name: { type: String, required: true },
  //créateur de la sauce
  manufacturer: { type: String, required: true },
  //description
  description: { type: String, required: true },
  //ingrédient principal
  mainPepper: { type: String, required: true },
  //url de l'image
  imageUrl: { type: String, required: true },
  //piquant de la sauce
  heat: { type: Number, required: true },
  //nombre de likes
  likes: { type: Number, default: 0 },
  //nombre de dislikes
  dislikes: { type: Number, default: 0 },
  //liste (array) des utilisateurs ayant liké
  usersLiked: { type: [String] },
  //array d'user ayant disliké
  usersDisliked: { type: [String] },
});

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la db.
// Utilise le HTML Sanitizer de Google Caja pour effectuer la désinfection.
sauceSchema.plugin(sanitizerPlugin);

//export du model
module.exports = mongoose.model('Sauce', sauceSchema);